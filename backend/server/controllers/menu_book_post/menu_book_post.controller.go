package menu_book_post

import (
	"context"
	"fmt"

	"dish-dash/pb/menu_book_post"
	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/file_service"
	"dish-dash/server/services/registrar_service"

	"github.com/golang/protobuf/ptypes/timestamp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type server struct {
	menu_book_post.UnimplementedMenuBookPostServiceServer
}

func (s *server) GetPostsFromMenuBook(ctx context.Context, in *menu_book_post.GetPostsFromMenuBookRequest) (*menu_book_post.GetPostsFromMenuBookResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	// offset := int((in.Page - 1) * in.PageSize)

	var menuBookPostEntities []*entities.PostInMenuBookEntity
	result := db.Where("holder_id = ?", userEntity.Id).Order("creation_date DESC").Find(&menuBookPostEntities)
	// result := db.Where("holder_id = ?", userEntity.Id).Order("creation_date DESC").Limit(int(in.PageSize)).
	// 	Offset(offset).
	// 	Find(&menuBookPostEntities)

	if result.Error != nil {
		return nil, result.Error
	}

	var grpcPosts []*menu_book_post.MenuBookPost
	for _, postEntity := range menuBookPostEntities {
		var picturesEntities []entities.PostPicturesEntity
		db.Where("menu_book_post_id = ?", postEntity.Id).Find(&picturesEntities)

		picturePaths := make([]string, 0, len(picturesEntities))
		for _, pictureEntity := range picturesEntities {
			picturePaths = append(picturePaths, pictureEntity.PicturePath)
		}

		grpcPost := &menu_book_post.MenuBookPost{
			Id:              postEntity.Id.String(),
			OriginalPostId:  postEntity.OriginalPostId.String(),
			OwnerId:         postEntity.OwnerId.String(),
			OwnerName:       postEntity.OwnerName,
			OwnerSurname:    postEntity.OwnerSurname,
			Title:           postEntity.Title,
			Ingredients:     postEntity.Ingredients,
			PortionQuantity: postEntity.PortionQuantity,
			Preparation:     postEntity.Preparation,
			PicturePath:     picturePaths,
			CreationDate:    &timestamp.Timestamp{Seconds: postEntity.CreationDate.Unix()}, // Convert time.Time to *timestamppb.Timestamp
		}
		grpcPosts = append(grpcPosts, grpcPost)
	}

	return &menu_book_post.GetPostsFromMenuBookResponse{Posts: grpcPosts}, nil
}

func (s *server) DeleteFromMenuBook(ctx context.Context, in *menu_book_post.DeleteFromMenuBookRequest) (*menu_book_post.DeleteFromMenuBookResponse, error) {
	db := database_service.GetDBInstance()

	userEntity, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var pictureEntity entities.PostPicturesEntity
	if err := db.Where("menu_book_post_id = ?", in.PostId).First(&pictureEntity).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			fmt.Printf("No pictures found. Skipping deletion")
		} else {
			return nil, status.Errorf(codes.Internal, "Error in getting pictures for delete")
		}
	} else {
		if err := db.Where("menu_book_post_id = ?", in.PostId).Delete(&entities.PostPicturesEntity{}).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Error in deleting pictures")
		}
		fmt.Printf(pictureEntity.PicturePath)
		err := file_service.DeleteImageFolder(pictureEntity.PicturePath)

		if err != nil {
			return nil, status.Errorf(codes.NotFound, "image not found")
		}
	}

	if err := db.Where("id = ? AND holder_id = ?", in.PostId, userEntity.Id).Delete(&entities.PostInMenuBookEntity{}).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to delete post from menu book: %v", err)
	}

	return &menu_book_post.DeleteFromMenuBookResponse{PostId: in.PostId}, nil
}

func (s *server) EditMenuBookPost(ctx context.Context, in *menu_book_post.EditMenuBookPostRequest) (*menu_book_post.EditMenuBookPostResponse, error) {
	db := database_service.GetDBInstance()

	_, err := auth_service.ValidateToken(in.Token)

	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Invalid token")
	}

	var postEntity entities.PostInMenuBookEntity
	err = db.Where("id = ?", in.PostId).First(&postEntity).Error
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "No post found")
	}

	err = db.Model(&postEntity).Updates(entities.PostInMenuBookEntity{
		Title:           in.Title,
		Ingredients:     in.Ingredients,
		Preparation:     in.Preparation,
		PortionQuantity: in.PortionQuantity,
	}).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error updating the post")
	}

	return &menu_book_post.EditMenuBookPostResponse{
		PostId:          in.PostId,
		Title:           in.Title,
		Ingredients:     in.Ingredients,
		Preparation:     in.Preparation,
		PortionQuantity: in.PortionQuantity,
	}, nil
}

func RegisterServer() {
	menu_book_post.RegisterMenuBookPostServiceServer(registrar_service.GetServerInstance(), &server{})
}
