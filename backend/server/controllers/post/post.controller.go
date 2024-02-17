package post

import (
	"context"
	"dish-dash/pb/post"
	"encoding/base64"
	"os"
	"strconv"
	"strings"

	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type server struct {
	post.PostServiceServer
}

func (s *server) Create(ctx context.Context, in *post.CreatePostRequest) (*post.CreatePostResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token, in.OwnerId)

	if err != nil {
		return &post.CreatePostResponse{Message: "Invalid token"}, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	userId, _ := uuid.Parse(in.OwnerId)

	postId := uuid.New()
	postPictures := []string{}

	// @TODO ogarnac zdjecia
	for index, picture := range in.Pictures {
		parts := strings.SplitN(picture, ",", 2)
		if len(parts) != 2 {
			return &post.CreatePostResponse{Message: "Wrong picture format"}, status.Errorf(codes.Unknown, "Invalid token")
		}

		decoded, err := base64.StdEncoding.DecodeString(parts[1])
		if err != nil {
			return &post.CreatePostResponse{Message: "Picture decoder error"}, status.Errorf(codes.Aborted, "Invalid token")
		}

		dirPath := "images/" + postId.String() + "/"
		filePath := dirPath + strconv.Itoa(index) + ".png"
		postPictures = append(postPictures, filePath)

		err = os.MkdirAll(dirPath, 0755) // Adjust permissions as needed
		if err != nil {
			return &post.CreatePostResponse{Message: "Path building error"}, status.Errorf(codes.Internal, "Invalid token")
		}

		err = os.WriteFile(filePath, decoded, 0666)
		if err != nil {
			return &post.CreatePostResponse{Message: "Failed to save an image"}, status.Errorf(codes.DataLoss, "Invalid token")

		}
	}

	newPost := &entities.PostEntity{
		BaseEntity: entities.BaseEntity{
			Id: postId,
		},
		OwnerId:         userId,
		OwnerName:       in.OwnerName,
		OwnerSurname:    in.OwnerSurname,
		Title:           in.Title,
		Ingredients:     in.Ingredients,
		PortionQuantity: in.PortionQuantity,
		Preparation:     in.Preparation,
	}

	result := db.Create(newPost)
	if err := result.Error; err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	for _, picturePath := range postPictures {
		newPicture := &entities.PostPicturesEntity{
			OwnerId:     userId,
			PostId:      postId,
			PicturePath: picturePath,
		}

		result := db.Create(newPicture)
		if err := result.Error; err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &post.CreatePostResponse{Message: "Successfully created post"}, nil
}

func RegisterServer() {
	post.RegisterPostServiceServer(registrar_service.GetServerInstance(), &server{})
}
