package auth

import (
	"context"
	"dish-dash/pb/auth"
	"dish-dash/server/entities"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"
	"errors"
	"log"

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

    // Check if the email already exists
    var existingUser entities.UserEntity
    if err := db.Where("email = ?", in.Email).First(&existingUser).Error; err == nil {
        // User with the email already exists
        log.Printf("Email already in use: %s", in.Email)
        return nil, status.Error(codes.AlreadyExists, "email already in use")
    } else if !errors.Is(err, gorm.ErrRecordNotFound) {
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
	if result.Error != nil {
		log.Printf("Error registering user: %s", result.Error)
		// Convert the error to a gRPC status error
		return nil, status.Error(codes.Internal, result.Error.Error())
	}

	return &auth.RegisterResponse{Message: "Successfully registered user."}, nil
}

func Register() {
	auth.RegisterAuthServer(registrar_service.GetServerInstance(), &server{})
}
