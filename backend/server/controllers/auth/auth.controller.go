package auth

import (
	"context"
	"dish-dash/pb/auth"
	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"
	"errors"
	"log"
	"regexp"
	"strings"

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

	log.Printf(token)

	return &auth.LoginResponse{Token: token}, nil
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
