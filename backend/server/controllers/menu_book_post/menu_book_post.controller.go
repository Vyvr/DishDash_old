package menu_book_post

import (
	"context"
	"log"

	"dish-dash/pb/menu_book_post"
	"dish-dash/server/entities"
	"dish-dash/server/services/auth_service"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"

	"github.com/golang/protobuf/ptypes/timestamp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
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

	offset := int((in.Page - 1) * in.PageSize)
	log.Println("before getting posts")

	var menuBookPostEntities []*entities.PostInMenuBookEntity
	result := db.Where("holder_id = ?", userEntity.Id).Order("creation_date DESC").Limit(int(in.PageSize)).
		Offset(offset).
		Find(&menuBookPostEntities)

	if result.Error != nil {
		return nil, result.Error
	}

	var grpcPosts []*menu_book_post.MenuBookPost
	for _, postEntity := range menuBookPostEntities {
		var picturesEntities []entities.PostPicturesEntity
		db.Where("post_id = ?", postEntity.OriginalPostId).Find(&picturesEntities)

		picturePaths := make([]string, 0, len(picturesEntities))
		for _, pictureEntity := range picturesEntities {
			picturePaths = append(picturePaths, pictureEntity.PicturePath)
		}

		grpcPost := &menu_book_post.MenuBookPost{
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

	return &menu_book_post.GetPostsFromMenuBookResponse{Posts: grpcPosts}, nil
}

func RegisterServer() {
	menu_book_post.RegisterMenuBookPostServiceServer(registrar_service.GetServerInstance(), &server{})
}
