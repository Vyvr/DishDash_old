package post

import (
	"context"
	"dish-dash/pb/post"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"sort"
	"strings"
	"time"

	"dish-dash/server/entities"
	"dish-dash/server/services/analytics_service"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/file_service"
	"dish-dash/server/services/registrar_service"

	"github.com/golang/protobuf/ptypes/timestamp"
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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
		LikesCount:      0,
		CommentsCount:   0,
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

func (s *server) Delete(ctx context.Context, in *post.DeletePostRequest) (*post.DeletePostResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	// Get post to delete
	var postEntity entities.PostEntity
	if err := db.Where("id = ?", in.PostId).First(&postEntity).Error; err != nil {
		return nil, status.Errorf(codes.NotFound, "Post not found")
	}

	// Get owner of the post
	if postEntity.OwnerId != userEntity.Id {
		return nil, status.Errorf(codes.Unauthenticated, "User is not an owner of the post")
	}

	// Delete comments
	if err := db.Where("post_id = ? AND user_id = ?", postEntity.Id, userEntity.Id).Delete(&entities.PostCommentsEntity{}).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Error in deleting comments")
	}

	// Delete likes
	if err := db.Where("post_id = ?", postEntity.Id).Delete(&entities.PostLikesEntity{}).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Error in deleting likes")
	}

	// Delete pictures
	var pictureEntity entities.PostPicturesEntity
	if err := db.Where("post_id = ?", postEntity.Id).First(&pictureEntity).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			fmt.Printf("No pictures found. Skipping deletion")
		} else {
			return nil, status.Errorf(codes.Internal, "Error in getting pictures for delete")
		}
	} else {
		if err := db.Where("post_id = ? AND owner_id = ?", postEntity.Id, userEntity.Id).Delete(&entities.PostPicturesEntity{}).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Error in deleting pictures")
		}
		err := file_service.DeleteImageFolder(pictureEntity.PicturePath)

		if err != nil {
			return nil, status.Errorf(codes.NotFound, "image not found")
		}
	}

	// Update PostInMenuBook original_post_id to null
	err = db.Model(&entities.PostInMenuBookEntity{}).Where("original_post_id = ?", in.PostId).Update("original_post_id", nil).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to null original_post_id: %v", err)
	}

	// Delete post
	if err := db.Where("id = ? AND owner_id = ?", postEntity.Id, userEntity.Id).Delete(&postEntity).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to delete post: %v", err)
	}

	return &post.DeletePostResponse{
		PostId: in.PostId,
	}, nil
}

func (s *server) Edit(ctx context.Context, in *post.EditPostRequest) (*post.EditPostResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.PostId).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	err = db.Model(&postEntity).Updates(entities.PostEntity{
		Title:           in.Title,
		Ingredients:     in.Ingredients,
		Preparation:     in.Preparation,
		PortionQuantity: in.PortionQuantity,
	}).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error updating the post")
	}

	return &post.EditPostResponse{
		PostId:          in.PostId,
		Title:           in.Title,
		Ingredients:     in.Ingredients,
		Preparation:     in.Preparation,
		PortionQuantity: in.PortionQuantity,
	}, nil
}

func (s *server) AddToMenuBook(ctx context.Context, in *post.AddToMenuBookRequest) (*post.AddToMenuBookResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.PostId).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	var pictures []entities.PostPicturesEntity
	err = db.Where("post_id = ?", in.PostId).Find(&pictures).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post pictures found")
	}

	postId := uuid.New()

	postInMenuBook := &entities.PostInMenuBookEntity{
		BaseEntity: entities.BaseEntity{
			Id: postId,
		},
		OriginalPostId:  postEntity.Id,
		OwnerId:         postEntity.OwnerId,
		HolderId:        userEntity.Id,
		OwnerName:       postEntity.OwnerName,
		OwnerSurname:    postEntity.OwnerSurname,
		Title:           postEntity.Title,
		Ingredients:     postEntity.Ingredients,
		PortionQuantity: postEntity.PortionQuantity,
		Preparation:     postEntity.Preparation,
		CreationDate:    postEntity.CreationDate,
	}

	originalLogger := db.Logger
	db.Logger = db.Logger.LogMode(logger.Silent)

	if err := db.Where("original_post_id = ? AND holder_id = ?", postEntity.Id, userEntity.Id).Find(&entities.PostInMenuBookEntity{}).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	db.Logger = originalLogger

	result := db.Create(postInMenuBook)
	if err := result.Error; err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	dirPath := "images/menu_book/" + postId.String() + "/"

	for _, picture := range pictures {
		pictureId := uuid.New()
		filePath := dirPath + pictureId.String() + ".png"

		newPicture := &entities.PostPicturesEntity{
			OwnerId:        picture.OwnerId,
			MenuBookPostId: postId,
			PicturePath:    filePath,
		}

		err = os.MkdirAll(dirPath, 0755)
		if err != nil {
			return nil, status.Errorf(codes.Internal, "Invalid token")
		}

		file_service.CopyFile(picture.PicturePath, filePath)

		result := db.Create(newPicture)
		if err := result.Error; err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &post.AddToMenuBookResponse{PostId: in.PostId}, nil
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
		dirPath := "images/posts/" + in.Id + "/"
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

	if len(postEntities) == 0 {
		lastPost := &post.Post{}

		grpcPosts = append(grpcPosts, lastPost)

		return &post.GetPostsResponse{
			Posts: grpcPosts,
		}, nil
	}

	for _, postEntity := range postEntities {
		var picturesEntities []entities.PostPicturesEntity
		db.Where("post_id = ?", postEntity.Id).Find(&picturesEntities)

		originalLogger := db.Logger
		db.Logger = db.Logger.LogMode(logger.Silent)

		var liked = false
		err := db.Where("user_id = ? AND post_id = ?", userEntity.Id.String(), postEntity.Id).First(&entities.PostLikesEntity{}).Error
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("Unexpected error while checking post like status: %v", err)
			}
		} else {
			liked = true
		}

		var isInMenuBook = false
		err = db.Where("holder_id = ? AND original_post_id = ?", userEntity.Id.String(), postEntity.Id).First(&entities.PostInMenuBookEntity{}).Error
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("Unexpected error while checking post like status: %v", err)
			}
		} else {
			isInMenuBook = true
		}

		db.Logger = originalLogger

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
			PicturePath:     picturePaths,
			LikesCount:      postEntity.LikesCount,
			CommentsCount:   postEntity.CommentsCount,
			Liked:           liked,
			IsInMenuBook:    isInMenuBook,
			CreationDate:    &timestamp.Timestamp{Seconds: postEntity.CreationDate.Unix()},
		}
		grpcPosts = append(grpcPosts, grpcPost)
	}

	return &post.GetPostsResponse{
		Posts: grpcPosts,
	}, nil
}

func (s *server) GetUserPosts(ctx context.Context, in *post.GetPostsRequest) (*post.GetPostsResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	offset := int((in.Page - 1) * in.PageSize)

	var postEntities []*entities.PostEntity
	result := db.Where("owner_id = ?", userEntity.Id).Order("creation_date DESC").Limit(int(in.PageSize)).
		Offset(offset).
		Find(&postEntities)

	if result.Error != nil {
		return nil, result.Error
	}

	var grpcPosts []*post.Post

	if len(postEntities) == 0 {
		lastPost := &post.Post{}

		grpcPosts = append(grpcPosts, lastPost)

		return &post.GetPostsResponse{
			Posts: grpcPosts,
		}, nil
	}

	for _, postEntity := range postEntities {
		var picturesEntities []entities.PostPicturesEntity
		db.Where("post_id = ?", postEntity.Id).Find(&picturesEntities)

		originalLogger := db.Logger
		db.Logger = db.Logger.LogMode(logger.Silent)

		var liked = false
		err := db.Where("user_id = ? AND post_id = ?", userEntity.Id.String(), postEntity.Id.String()).First(&entities.PostLikesEntity{}).Error
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("Unexpected error while checking post like status: %v", err)
			}
		} else {
			liked = true
		}

		var isInMenuBook = false
		err = db.Where("holder_id = ? AND original_post_id = ?", userEntity.Id.String(), postEntity.Id).First(&entities.PostInMenuBookEntity{}).Error
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("Unexpected error while checking post like status: %v", err)
			}
		} else {
			isInMenuBook = true
		}
		db.Logger = originalLogger

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
			PicturePath:     picturePaths,
			LikesCount:      postEntity.LikesCount,
			CommentsCount:   postEntity.CommentsCount,
			Liked:           liked,
			IsInMenuBook:    isInMenuBook,
			CreationDate:    &timestamp.Timestamp{Seconds: postEntity.CreationDate.Unix()},
		}
		grpcPosts = append(grpcPosts, grpcPost)
	}

	return &post.GetPostsResponse{
		Posts: grpcPosts,
	}, nil
}

func (s *server) GetImageStream(req *post.GetImageStreamRequest, stream post.PostService_GetImageStreamServer) error {
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

	postId := strings.Split(imagePath, "/")[1]

	buffer := make([]byte, 2000000) // Ustawianie wielkości bufora
	for {
		n, err := file.Read(buffer)
		if err == io.EOF {
			break // EOF oznaczający koniec pliku
		}
		if err != nil {
			return status.Errorf(codes.Internal, "Error while reading picture: %v", err)
		}

		if err := stream.Send(&post.GetImageStreamResponse{
			ImageData:   buffer[:n],
			PostId:      postId,
			PicturePath: req.PicturePath,
		}); err != nil {
			return status.Errorf(codes.Internal, "Error sending chunk to client: %v", err)
		}
	}
	// Na koniec strumienia zwracana jest wartość nil zapewniająca zakończenie bez błędu
	return nil
}

func (s *server) GetAllPostAnaliticsData(ctx context.Context, in *post.GetAllPostAnaliticsDataRequest) (*post.GetAllPostAnaliticsDataResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	now := time.Now()
	currentYear := now.Year()

	startOfYear := time.Date(currentYear, time.January, 1, 0, 0, 0, 0, now.Location())
	endOfYear := time.Date(currentYear, time.December, 31, 23, 59, 59, 999999999, now.Location())

	var likesEntities []entities.PostLikesEntity
	err = db.Joins("JOIN post_entities ON post_entities.id = post_likes_entities.post_id").
		Where("post_entities.owner_id = ? AND post_likes_entities.creation_date BETWEEN ? AND ?", userEntity.Id, startOfYear, endOfYear).
		Find(&likesEntities).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error in getting likes for analytics data")
	}

	var commentsEntities []entities.PostCommentsEntity
	err = db.Joins("JOIN post_entities ON post_entities.id = post_comments_entities.post_id").
		Where("post_entities.owner_id = ? AND post_comments_entities.creation_date BETWEEN ? AND ?", userEntity.Id, startOfYear, endOfYear).
		Find(&commentsEntities).Error

	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error in getting comments for analytics data")
	}

	var likesYearMap = analytics_service.GetYearMap()
	var commentsYearMap = analytics_service.GetYearMap()

	for _, like := range likesEntities {
		month := like.CreationDate.Month()
		likesYearMap[int(month)]++
	}

	for _, comment := range commentsEntities {
		month := comment.CreationDate.Month()
		commentsYearMap[int(month)]++
	}

	var likesCount []int64
	var commentsCount []int64

	for month := 1; month <= 12; month++ {
		likesCount = append(likesCount, int64(likesYearMap[month]))
		commentsCount = append(commentsCount, int64(commentsYearMap[month]))
	}

	return &post.GetAllPostAnaliticsDataResponse{
		LikesCount:    likesCount,
		CommentsCount: commentsCount,
	}, nil
}

// @TODO pomyslec nad zastosowaniem transakcji, to samo do komentarzy
func (s *server) LikePost(ctx context.Context, in *post.ToggleLikeRequest) (*post.ToggleLikeResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.Id).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	likeEntity := &entities.PostLikesEntity{
		UserId: userEntity.Id,
		PostId: postEntity.Id,
	}

	result := db.Create(likeEntity)
	if err := result.Error; err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	postEntity.LikesCount += 1
	err = db.Model(&entities.PostEntity{}).Where("id = ?", postEntity.Id).Update("likes_count", postEntity.LikesCount).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to update likes count: %v", err)
	}

	return &post.ToggleLikeResponse{PostId: postEntity.Id.String()}, nil
}

func (s *server) UnlikePost(ctx context.Context, in *post.ToggleLikeRequest) (*post.ToggleLikeResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity *entities.PostEntity
	err = db.Where("id = ?", in.Id).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	likesEntity := &entities.PostLikesEntity{
		UserId: userEntity.Id,
		PostId: postEntity.Id,
	}

	if err := db.Where("user_id = ? AND post_id = ?", likesEntity.UserId, likesEntity.PostId).Delete(&entities.PostLikesEntity{}).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to dislike: %v", err)
	}

	postEntity.LikesCount -= 1
	err = db.Model(&entities.PostEntity{}).Where("id = ?", postEntity.Id).Update("likes_count", postEntity.LikesCount).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to update likes count: %v", err)
	}

	return &post.ToggleLikeResponse{PostId: postEntity.Id.String()}, nil
}

func (s *server) GetComments(ctx context.Context, in *post.GetCommentsRequest) (*post.GetCommentsResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	offset := int((in.Page - 1) * in.PageSize)

	var commentEntities []*entities.PostCommentsEntity
	result := db.Where("post_id = ?", in.PostId).Order("creation_date DESC").Limit(int(in.PageSize)).
		Offset(offset).
		Find(&commentEntities)

	if result.Error != nil {
		return nil, result.Error
	}

	var grpcComments []*post.Comment
	for _, commentEntity := range commentEntities {
		var owned = false
		if userEntity.Id.String() == commentEntity.UserId.String() {
			owned = true
		}

		var user entities.UserEntity
		if err := db.Where("id = ?", commentEntity.UserId).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, status.Error(codes.NotFound, "user not found")
			}
			return nil, status.Error(codes.Internal, "internal server error")
		}

		grpcComment := &post.Comment{
			Id:           commentEntity.Id.String(),
			UserId:       userEntity.Id.String(),
			UserName:     user.Name,
			UserSurname:  user.Surname,
			CommentText:  commentEntity.CommentText,
			Owned:        owned,
			CreationDate: &timestamp.Timestamp{Seconds: commentEntity.CreationDate.Unix()},
		}

		grpcComments = append(grpcComments, grpcComment)
	}

	sort.Slice(grpcComments, func(i, j int) bool {
		return grpcComments[j].CreationDate.AsTime().Before(grpcComments[i].CreationDate.AsTime())
	})

	return &post.GetCommentsResponse{Comments: grpcComments, PostId: in.PostId}, nil
}

func (s *server) CommentPost(ctx context.Context, in *post.CommentPostRequest) (*post.CommentPostResponse, error) {
	if len(in.CommentText) == 0 {
		return nil, status.Errorf(codes.Aborted, "Comment too short")
	}

	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.Id).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	creationDate := timestamppb.Now()

	commentEntity := &entities.PostCommentsEntity{
		PostId:       postEntity.Id,
		UserId:       userEntity.Id,
		CommentText:  in.CommentText,
		CreationDate: creationDate.AsTime(),
	}

	result := db.Create(commentEntity)
	if err := result.Error; err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	postEntity.CommentsCount += 1
	err = db.Model(&entities.PostEntity{}).Where("id = ?", postEntity.Id).Update("comments_count", postEntity.CommentsCount).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to update comments count: %v", err)
	}

	comment := post.Comment{
		Id:           commentEntity.Id.String(),
		UserId:       userEntity.Id.String(),
		UserName:     userEntity.Name,
		UserSurname:  userEntity.Surname,
		CommentText:  commentEntity.CommentText,
		Owned:        true,
		CreationDate: creationDate,
	}

	return &post.CommentPostResponse{PostId: in.Id, Comment: &comment}, nil
}

func (s *server) EditComment(ctx context.Context, in *post.EditCommentRequest) (*post.CommentOperationMessageResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.PostId).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	var commentEntity entities.PostCommentsEntity
	err = db.Where("id = ?", in.CommentId).First(&commentEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "Comment not found: %v", err)
	}

	commentEntity.CommentText = in.CommentText
	err = db.Model(&entities.PostCommentsEntity{}).Where("id = ?", commentEntity.Id).Update("comment_text", commentEntity.CommentText).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to update comment %v", err)
	}

	return &post.CommentOperationMessageResponse{PostId: in.PostId, CommentId: in.CommentId, CommentText: in.CommentText}, nil
}

func (s *server) DeleteComment(ctx context.Context, in *post.DeleteCommentRequest) (*post.CommentOperationMessageResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostEntity
	err = db.Where("id = ?", in.PostId).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	if err = db.Where("id = ?", in.CommentId).Delete(&entities.PostCommentsEntity{}).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to delete comment: %v", err)
	}

	postEntity.CommentsCount -= 1
	err = db.Model(&entities.PostEntity{}).Where("id = ?", postEntity.Id).Update("comments_count", postEntity.CommentsCount).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to update comments count: %v", err)
	}

	return &post.CommentOperationMessageResponse{PostId: in.PostId, CommentId: in.CommentId}, nil
}

func RegisterServer() {
	post.RegisterPostServiceServer(registrar_service.GetServerInstance(), &server{})
}
