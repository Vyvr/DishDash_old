package user

import (
	// "context"
	"context"
	"dish-dash/pb/user"
	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

// server is the server for User service.
type server struct {
    user.UnimplementedUserServer
}

// GetUser retrieves a user based on a given ID or other parameters.
func (s *server) Get(ctx context.Context, in *user.GetRequest) (*user.GetResponse, error) {
    // Validate the token to authenticate the user and get the claims
    claims, err := auth_service.ValidateToken(in.GetToken(), in.GetId())
    if err != nil {
        // If the token is invalid or the user ID does not match, return an error
        return nil, status.Error(codes.Unauthenticated, err.Error())
    }

    // At this point, the token is valid and the user ID matches, so you can proceed to retrieve the user data
    db := database_service.GetDBInstance()

    // Retrieve the user by ID
    var userEntity entities.UserEntity
    if err := db.First(&userEntity, "id = ?", claims.UserID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, status.Errorf(codes.NotFound, "user not found")
        }
        return nil, status.Errorf(codes.Internal, "failed to retrieve user: %v", err)
    }

    // Construct the response with the user data
    response := &user.GetResponse{
        Id:          userEntity.Id.String(),
        Name:        &userEntity.Name,
        Surname:     &userEntity.Surname,
        Email:       &userEntity.Email,
        Description: &userEntity.Description,
    }

    return response, nil
}


// UpdateUser handles updating a user's information.
func (s *server) Update(ctx context.Context, in *user.UpdateRequest) (*user.UpdateResponse, error) {
    // Validate the token to authenticate the user
    claims, err := auth_service.ValidateToken(in.GetToken(), in.GetId())
    if err != nil {
        // If the token is invalid or the user ID does not match, return an error
        return nil, status.Errorf(codes.Unauthenticated, "unauthorized access: %v", err)
    }

    db := database_service.GetDBInstance()

    // Retrieve the user by ID from the claims
    var userEntity entities.UserEntity
    if err := db.First(&userEntity, "id = ?", claims.UserID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, status.Errorf(codes.NotFound, "user not found")
        }
        return nil, status.Errorf(codes.Internal, "failed to retrieve user: %v", err)
    }

    // Update fields if they are provided in the request
    if in.GetName() != "" {
        userEntity.Name = in.GetName()
    }
    if in.GetSurname() != "" {
        userEntity.Surname = in.GetSurname()
    }
    if in.GetEmail() != "" {
        userEntity.Email = strings.ToLower(in.GetEmail())
    }
    if in.GetDescription() != "" {
        userEntity.Description = in.GetDescription()
    }
    if in.GetPassword() != "" {
        // Hash the new password before saving it
        hashedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(in.GetPassword()), bcrypt.DefaultCost)
        if hashErr != nil {
            return nil, status.Errorf(codes.Internal, "failed to hash password: %v", hashErr)
        }
        userEntity.Password = string(hashedPassword)
    }

    // Save the updated entity back to the database
    if updateErr := db.Save(&userEntity).Error; updateErr != nil {
        return nil, status.Errorf(codes.Internal, "failed to update user: %v", updateErr)
    }

    // Return a success message
    return &user.UpdateResponse{
        Message: "User updated successfully",
    }, nil
}


// DeleteUser handles the deletion of a user.
func (s *server) Delete(ctx context.Context, in *user.DeleteRequest) (*user.DeleteResponse, error) {
    // Validate the token first
    claims, err := auth_service.ValidateToken(in.GetToken(), in.GetId())
    if err != nil {
        // If the token is invalid or the user ID does not match, return an error
        return nil, status.Error(codes.Unauthenticated, err.Error())
    }

    db := database_service.GetDBInstance()

	// Retrieve the user by ID from the claims
	var userEntity entities.UserEntity
	if err := db.First(&userEntity, "id = ?", claims.UserID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Errorf(codes.NotFound, "user not found")
		}
		return nil, status.Errorf(codes.Internal, "failed to retrieve user: %v", err)
	}

	if userEntity.Email != in.GetEmail() {
		return nil, status.Error(codes.PermissionDenied, "Email does not match")
	}

    // Compare the provided password with the hashed password
    if err := bcrypt.CompareHashAndPassword([]byte(userEntity.Password), []byte(in.GetPassword())); err != nil {
        // Password does not match
        return nil, status.Error(codes.PermissionDenied, "Invalid credentials")
    }

    // Perform the delete operation
    result := db.Where("id = ?", claims.UserID).Delete(&entities.UserEntity{})
    if result.Error != nil {
        // Handle possible errors from the delete operation
        if errors.Is(result.Error, gorm.ErrRecordNotFound) {
            return nil, status.Errorf(codes.NotFound, "user not found")
        }
        return nil, status.Errorf(codes.Internal, "failed to delete user: %v", result.Error)
    }

    // Check if the user was actually deleted, gorm's Delete method does not return gorm.ErrRecordNotFound if nothing was deleted
    if result.RowsAffected == 0 {
        return nil, status.Errorf(codes.NotFound, "user not found")
    }

    // Return a success message
    return &user.DeleteResponse{
        Message: "User deleted successfully",
    }, nil
}

func (S *server) GetByQuery(ctx context.Context, in  *user.GetByQueryRequest) (*user.GetUsersResponse, error) {
    _, err := auth_service.ValidateToken(in.Token, in.UserId)
    if err != nil {
        // If the token is invalid or the user ID does not match, return an error
        return nil, status.Error(codes.Unauthenticated, err.Error())
    }

    var users []*user.UserBasicInfo

    if len(in.QueryString) == 0 {
        return &user.GetUsersResponse{Users: users}, nil
    }

    db := database_service.GetDBInstance()

    var userEntities []entities.UserEntity
    queryString := "%" + in.QueryString + "%"
    result := db.Where("name ILIKE ? OR surname ILIKE ?", queryString, queryString).Find(&userEntities)
    if result.Error != nil {
        return nil, status.Errorf(codes.Internal, "Failed to search users: %v", result.Error)
    }

    for _, userEntity := range userEntities {
        grpcUser := &user.UserBasicInfo{
            Id:      userEntity.Id.String(),
            Name:    userEntity.Name,
            Surname: userEntity.Surname,
        }
        users = append(users, grpcUser)
    }

    
    return &user.GetUsersResponse{Users: users}, nil
}

// RegisterUserService registers the user service to a gRPC server.
func RegisterServer() {
    user.RegisterUserServer(registrar_service.GetServerInstance(), &server{})
}
