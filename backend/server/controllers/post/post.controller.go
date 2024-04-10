package post

import (
	"context"
	"dish-dash/pb/post"
	"encoding/base64"
	"errors"
	"io"
	"log"
	"os"
	"sort"
	"strings"

	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
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

	postInMenuBook := &entities.PostInMenuBookEntity{
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

	/*@TODO do something with this fucking logger
	* without this switches it's logging "not found"
	* for every not liked post. It's annoying
	 */
	// Backup the original logger
	originalLogger := db.Logger

	// Set a temporary logger that ignores "record not found" errors
	db.Logger = db.Logger.LogMode(logger.Silent)

	if err := db.Where("original_post_id = ? AND holder_id = ?", postEntity.Id, userEntity.Id).Find(&entities.PostInMenuBookEntity{}).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	// Restore the original logger
	db.Logger = originalLogger

	result := db.Create(postInMenuBook)
	if err := result.Error; err != nil {
		return nil, status.Error(codes.Internal, err.Error())
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
		dirPath := "images/posts" + in.Id + "/"
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
	for _, postEntity := range postEntities {
		var picturesEntities []entities.PostPicturesEntity
		//@TODO moze warunek na to jak by post nie zostal znaleziony? To samo z lajkiem
		db.Where("post_id = ?", postEntity.Id).Find(&picturesEntities)

		// check if post is liked
		/*@TODO do something with this fucking logger
		* without this switches it's logging "not found"
		* for every not liked post. It's annoying
		 */
		// Backup the original logger
		originalLogger := db.Logger

		// Set a temporary logger that ignores "record not found" errors
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

		//check if post is in menu book
		var isInMenuBook = false
		err = db.Where("holder_id = ? AND original_post_id = ?", userEntity.Id.String(), postEntity.Id).First(&entities.PostInMenuBookEntity{}).Error
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("Unexpected error while checking post like status: %v", err)
			}
		} else {
			isInMenuBook = true
		}
		// Restore the original logger
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
			Pictures:        picturePaths,
			LikesCount:      postEntity.LikesCount,
			CommentsCount:   postEntity.CommentsCount,
			Liked:           liked,
			IsInMenuBook:    isInMenuBook,
			CreationDate:    &timestamp.Timestamp{Seconds: postEntity.CreationDate.Unix()}, // Convert time.Time to *timestamppb.Timestamp
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
	for _, postEntity := range postEntities {
		var picturesEntities []entities.PostPicturesEntity
		//@TODO moze warunek na to jak by post nie zostal znaleziony? To samo z lajkiem
		db.Where("post_id = ?", postEntity.Id).Find(&picturesEntities)

		// check if post is liked
		/*@TODO do something with this fucking logger
		* without this switches it's logging "not found"
		* for every not liked post. It's annoying
		 */
		// Backup the original logger
		originalLogger := db.Logger

		// Set a temporary logger that ignores "record not found" errors
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

		//check if post is in menu book
		var isInMenuBook = false
		err = db.Where("holder_id = ? AND original_post_id = ?", userEntity.Id.String(), postEntity.Id).First(&entities.PostInMenuBookEntity{}).Error
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("Unexpected error while checking post like status: %v", err)
			}
		} else {
			isInMenuBook = true
		}
		// Restore the original logger
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
			Pictures:        picturePaths,
			LikesCount:      postEntity.LikesCount,
			CommentsCount:   postEntity.CommentsCount,
			Liked:           liked,
			IsInMenuBook:    isInMenuBook,
			CreationDate:    &timestamp.Timestamp{Seconds: postEntity.CreationDate.Unix()}, // Convert time.Time to *timestamppb.Timestamp
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

	buffer := make([]byte, 5000000) // Adjust the buffer size to your needs
	for {
		n, err := file.Read(buffer)
		if err == io.EOF {
			break // EOF is expected when reading the last chunk of the file
		}
		if err != nil {
			return status.Errorf(codes.Internal, "Error reading picture: %v", err)
		}

		if err := stream.Send(&post.GetImageStreamResponse{ImageData: buffer[:n], PostId: postId, PicturePath: req.PicturePath}); err != nil {
			return status.Errorf(codes.Internal, "Error sending chunk to client: %v", err)
		}
	}
	// At the end of the stream, return nil to indicate the stream is complete without errors
	return nil
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
