package post

import (
	"context"
	"dish-dash/pb/post"
	"encoding/base64"
	"os"
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
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	userId, _ := uuid.Parse(in.OwnerId)

	postId := uuid.New()

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

	return &post.CreatePostResponse{
		PostId:          newPost.Id.String(),
		OwnerId:         newPost.OwnerId.String(),
		OwnerName:       newPost.OwnerName,
		OwnerSurname:    newPost.OwnerSurname,
		Title:           newPost.Title,
		Ingredients:     newPost.Ingredients,
		PortionQuantity: newPost.PortionQuantity,
		Preparation:     newPost.Preparation,
	}, nil
}

func (s *server) AddImages(ctx context.Context, in *post.AddPostImagesRequest) (*post.AddPostImagesResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token, in.OwnerId)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.PostId).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	postId, _ := uuid.Parse(in.PostId)
	ownerId, _ := uuid.Parse(in.OwnerId)
	postPictures := []string{}

	// @TODO ogarnac zdjecia
	for _, picture := range in.Images {
		parts := strings.SplitN(picture, ",", 2)
		if len(parts) != 2 {
			return nil, status.Errorf(codes.Unknown, "Invalid token")
		}

		decoded, err := base64.StdEncoding.DecodeString(parts[1])
		if err != nil {
			return nil, status.Errorf(codes.Aborted, "Invalid token")
		}
		pictureId := uuid.New()
		dirPath := "images/" + in.PostId + "/"
		filePath := dirPath + pictureId.String() + ".png"
		postPictures = append(postPictures, filePath)

		err = os.MkdirAll(dirPath, 0755) // Adjust permissions as needed
		if err != nil {
			return nil, status.Errorf(codes.Internal, "Invalid token")
		}

		err = os.WriteFile(filePath, decoded, 0666)
		if err != nil {
			return nil, status.Errorf(codes.DataLoss, "Invalid token")

		}
	}

	for _, picturePath := range postPictures {
		newPicture := &entities.PostPicturesEntity{
			OwnerId:     ownerId,
			PostId:      postId,
			PicturePath: picturePath,
		}

		result := db.Create(newPicture)
		if err := result.Error; err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &post.AddPostImagesResponse{
		Message: "Success",
	}, nil
}

func RegisterServer() {
	post.RegisterPostServiceServer(registrar_service.GetServerInstance(), &server{})
}
