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

	"github.com/golang/protobuf/ptypes/timestamp"
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type server struct {
	post.PostServiceServer
}

func (s *server) Create(ctx context.Context, in *post.CreatePostRequest) (*post.CreatePostResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	userId, _ := uuid.Parse(in.OwnerId)

	var userEntity entities.UserEntity
	if err := db.Where("id = ?", userId).First(&userEntity).Error; err != nil {
		return nil, status.Errorf(codes.NotFound, "User not found")
	}

	postId := uuid.New()

	newPost := &entities.PostEntity{
		BaseEntity: entities.BaseEntity{
			Id: postId,
		},
		OwnerId:         userId,
		OwnerName:       userEntity.Name,
		OwnerSurname:    userEntity.Surname,
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
		Id:              newPost.Id.String(),
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

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.Id).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	postId, _ := uuid.Parse(in.Id)
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
		dirPath := "images/" + in.Id + "/"
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

// func (s *server) GetUserPosts(ctx context.Context, in *post.GetUserPostsRequest) (*post.GetUserPostsResponse, error) {
// 	db := database_service.GetDBInstance()

// 	_, err := auth_service.ValidateToken(in.Token, in.Id)

// 	if err != nil {
// 		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
// 	}

// 	// Retrieve posts
// 	var posts []entities.PostEntity
// 	err = db.Where("owner_id = ?", in.Id).Find(&posts).Error
// 	if err != nil {
// 		return nil, status.Errorf(codes.Internal, "Failed to retrieve posts: %v", err)
// 		}

// 	return &post.GetUserPostsResponse{
// 		Posts: posts,
// 	}, nil
// }

func (s *server) GetPosts(ctx context.Context, in *post.GetPostsRequest) (*post.GetPostsResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var friendRelations []entities.FriendsEntity
	db.Where("user_a_id = ? OR user_b_id = ?", userEntity.Id, userEntity.Id).Find(&friendRelations)

	friendIds := make([]uuid.UUID, 0, len(friendRelations))
	for _, relation := range friendRelations {
		if relation.UserAID == userEntity.Id {
			friendIds = append(friendIds, relation.UserBID)
		} else {
			friendIds = append(friendIds, relation.UserAID)
		}
	}

	offset := int((in.Page - 1) * in.PageSize)

	var postEntities []*entities.PostEntity
	result := db.Where("owner_id IN ?", friendIds).Order("creation_date DESC").Limit(int(in.PageSize)).
		Offset(offset).
		Find(&postEntities)

	if result.Error != nil {
		return nil, result.Error
	}

	var grpcPosts []*post.Post
	for _, postEntity := range postEntities {
		var picturesEntities []entities.PostPicturesEntity
		db.Where("post_id = ?", postEntity.Id).Find(&picturesEntities)

		picturePaths := make([]string, 0, len(picturesEntities))
		for _, pictureEntity := range picturesEntities {
			picturePaths = append(picturePaths, pictureEntity.PicturePath)
		}

		grpcPost := &post.Post{
			Id:              postEntity.Id.String(),
			OwnerId:         postEntity.OwnerId.String(),
			OwnerName:       postEntity.OwnerName,
			OwnerSurname:    postEntity.OwnerSurname,
			Title:           postEntity.Title,
			Ingredients:     postEntity.Ingredients,
			PortionQuantity: postEntity.PortionQuantity,
			Preparation:     postEntity.Preparation,
			Pictures:        picturePaths,
			CreationDate:    &timestamp.Timestamp{Seconds: postEntity.CreationDate.Unix()}, // Convert time.Time to *timestamppb.Timestamp
		}
		grpcPosts = append(grpcPosts, grpcPost)
	}

	return &post.GetPostsResponse{
		Posts: grpcPosts,
	}, nil
}

func RegisterServer() {
	post.RegisterPostServiceServer(registrar_service.GetServerInstance(), &server{})
}
