package auth

import (
	"context"
	"dish-dash/pb/auth"
	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"
	"encoding/base64"
	"errors"
	"io"
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type server struct {
	auth.UnimplementedAuthServer
}

func (s *server) Register(ctx context.Context, in *auth.RegisterRequest) (*auth.RegisterResponse, error) {
	db := database_service.GetDBInstance()

	in.Email = strings.ToLower(in.Email)

	if !isValidEmail(in.Email) {
		return nil, status.Error(codes.InvalidArgument, "invalid email format")
	}

	if !isValidPassword(in.Password) {
		return nil, status.Error(codes.InvalidArgument, "invalid password format")
	}

	if len(in.Name) < 1 || len(in.Surname) < 1 {
		return nil, status.Error(codes.InvalidArgument, "invalid name or surname format")
	}

	// Check if the email already exists
	var existingUser entities.UserEntity
	err := db.Where("email = ?", in.Email).First(&existingUser).Error
	if err == nil {
		// User with the email already exists
		log.Printf("Email already in use: %s", in.Email)
		return nil, status.Error(codes.AlreadyExists, "email already in use")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		// An unexpected error occurred
		log.Printf("Error checking existing user: %s", err)
		return nil, status.Error(codes.Internal, "internal server error")
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %s", err)
		return nil, status.Error(codes.Internal, "failed to hash password")
	}

	newUser := &entities.UserEntity{
		Email:    in.Email,
		Name:     in.Name,
		Surname:  in.Surname,
		Password: string(hashedPassword),
	}

	result := db.Create(newUser)
	if err := result.Error; err != nil {
		log.Printf("Error registering user: %s", err)
		// Convert the error to a gRPC status error
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &auth.RegisterResponse{Message: "Successfully registered user."}, nil
}

func (s *server) Login(ctx context.Context, in *auth.LoginRequest) (*auth.LoginResponse, error) {
	db := database_service.GetDBInstance()

	in.Email = strings.ToLower(in.Email)

	// Find user by email
	var user entities.UserEntity
	if err := db.Where("email = ?", in.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Error(codes.NotFound, "user not found")
		}
		return nil, status.Error(codes.Internal, "internal server error")
	}

	// Compare the provided password with the hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(in.Password)); err != nil {
		// Password does not match
		return nil, status.Error(codes.Unauthenticated, "invalid credentials")
	}

	// Generate a token (implementation depends on your token generation logic)
	token, err := auth_service.GenerateJWTToken(user)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to generate token")
	}

	return &auth.LoginResponse{Token: token, Id: user.Id.String(), Name: user.Name, Surname: user.Surname}, nil
}

func (s *server) RefreshToken(ctx context.Context, in *auth.RefreshTokenRequest) (*auth.LoginResponse, error) {
	userEntity, token, err := auth_service.RefreshJWTToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	return &auth.LoginResponse{
		Token:   token,
		Id:      userEntity.Id.String(),
		Name:    userEntity.Name,
		Surname: userEntity.Surname}, nil
}

func (s *server) GetUserPicture(req *auth.GetUserPictureRequest, stream auth.Auth_GetUserPictureServer) error {
	_, err := auth_service.ValidateToken(req.Token)

	if err != nil {
		return status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	imagePath := req.PicturePath

	file, err := os.Open(imagePath)
	if err != nil {
		return status.Errorf(codes.Internal, "Can't open picture from path")
	}
	defer file.Close()

	buffer := make([]byte, 5000000) // Adjust the buffer size to your needs
	for {
		n, err := file.Read(buffer)
		if err == io.EOF {
			break // EOF is expected when reading the last chunk of the file
		}
		if err != nil {
			return status.Errorf(codes.Internal, "Error reading picture: %v", err)
		}

		if err := stream.Send(&auth.GetUserPictureResponse{ImageData: buffer[:n]}); err != nil {
			return status.Errorf(codes.Internal, "Error sending chunk to client: %v", err)
		}
	}
	// At the end of the stream, return nil to indicate the stream is complete without errors
	return nil
}

func (s *server) AddUserPicture(ctx context.Context, in *auth.AddUserPictureRequest) (*auth.AddUserPictureResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var userEntity entities.UserEntity
	err = db.Where("id = ?", in.UserId).First(&userEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No user found")
	}

	picture := in.Image

	parts := strings.SplitN(picture, ",", 2)
	if len(parts) != 2 {
		return nil, status.Errorf(codes.Unknown, "Wrong picture format")
	}

	decoded, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, status.Errorf(codes.Aborted, "Encoding error")
	}

	pictureId := uuid.New()
	dirPath := "images/profile_pictures/" + in.UserId + "/"
	filePath := dirPath + pictureId.String() + ".png"

	err = os.MkdirAll(dirPath, 0755) // Adjust permissions as needed
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error in making file folder")
	}

	err = os.WriteFile(filePath, decoded, 0666)
	if err != nil {
		return nil, status.Errorf(codes.DataLoss, "Error with saving picture")

	}

	err = db.Model(&userEntity).Updates(entities.UserEntity{
		PicturePath: filePath,
	}).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error adding profile picture")
	}

	return &auth.AddUserPictureResponse{
		Message: "Success",
	}, nil
}

func (s *server) ValidateToken(ctx context.Context, in *auth.ValidateTokenRequest) (*auth.ValidateTokenResponse, error) {
	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return &auth.ValidateTokenResponse{IsValid: false}, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	return &auth.ValidateTokenResponse{IsValid: true}, nil
}

func isValidEmail(email string) bool {
	regex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return regex.MatchString(email)
}

func isValidPassword(password string) bool {
	return len(password) >= 7
}

func RegisterServer() {
	auth.RegisterAuthServer(registrar_service.GetServerInstance(), &server{})
}
