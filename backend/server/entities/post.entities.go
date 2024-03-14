package entities

import (
	"time"

	"github.com/google/uuid"
)

// @TODO: finnish this crap
type PostEntity struct {
	BaseEntity
	OwnerId         uuid.UUID `gorm:"type:uuid;not null"`
	OwnerName       string    `gorm:"type:text"`
	OwnerSurname    string    `gorm:"type:text"`
	Title           string    `gorm:"type:text"`
	Ingredients     string    `gorm:"type:text"`
	PortionQuantity int64     `gorm:"type:integer"`
	Preparation     string    `gorm:"type:text"`
	LikesCount      int64     `gorm:"type:integer;default:0"`
	CommentsCount   int64     `gorm:"type:integer;default:0"`
	CreationDate    time.Time `gorm:"type:timestamp;default:current_timestamp"`

	Owner UserEntity `gorm:"foreignKey:OwnerId;constraint:OnDelete:CASCADE"`
	// Pictures    	[]PostPicturesEntity  	`gorm:"foreignKey:PostId;constraint:OnDelete:CASCADE"`
}

type PostPicturesEntity struct {
	BaseEntity
	OwnerId     uuid.UUID `gorm:"type:uuid;not null"`
	PostId      uuid.UUID `gorm:"type:uuid;not null"`
	PicturePath string    `gorm:"type:text;not null"`

	Post  PostEntity `gorm:"foreignKey:PostId;constraint:OnDelete:CASCADE"`
	Owner UserEntity `gorm:"foreignKey:OwnerId;constraint:OnDelete:CASCADE"`
}

type PostLikesEntity struct {
	PostId       uuid.UUID `gorm:"type:uuid;not null;primaryKey"`
	UserId       uuid.UUID `gorm:"type:uuid;not null;primaryKey"`
	CreationDate time.Time `gorm:"type:timestamp;default:current_timestamp"`

	Post PostEntity `gorm:"foreignKey:PostId;constraint:OnDelete:CASCADE"`
	User UserEntity `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
}

type PostCommentsEntity struct {
	BaseEntity
	PostId       uuid.UUID `gorm:"type:uuid;not null;primaryKey"`
	UserId       uuid.UUID `gorm:"type:uuid;not null;primaryKey"`
	CommentText  string    `gorm:"type:text;not null"`
	CreationDate time.Time `gorm:"type:timestamp;default:current_timestamp"`

	Post PostEntity `gorm:"foreignKey:PostId;constraint:OnDelete:CASCADE"`
	User UserEntity `gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
}
