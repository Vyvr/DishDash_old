package post

import (
	"context"
	"dish-dash/pb/post"
	"log"

	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type server struct {
    post.PostServiceServer
}

func (s*server) Create(ctx context.Context, in *post.CreatePostRequest) (*post.CreatePostResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token, in.OwnerId)

	if err != nil {
		return &post.CreatePostResponse{Message: "Invalid token"}, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	newPost := &entities.PostEntity{
		OwnerId:         string(in.OwnerId),
		OwnerName:       in.OwnerName,
		OwnerSurname:    in.OwnerSurname,
		Title:           in.Title,
		Ingredients:     in.Ingredients,
		PortionQuantity: int(in.PortionQuantity),
		Preparation:     in.Preparation,
		Pictures:        in.Pictures,
	}

	// @TODO ogarnac zdjecia
	for _, picture := range in.Pictures {
		log.Printf(picture)
	}

	result := db.Create(newPost)
	if err := result.Error; err != nil {
		log.Printf("Error creating post: %s", err)
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &post.CreatePostResponse{Message: "Successfully created post"}, nil
}

func RegisterServer() {
    post.RegisterPostServiceServer(registrar_service.GetServerInstance(), &server{})
}