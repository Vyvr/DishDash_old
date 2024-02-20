package entities

import (
	"time"

	"github.com/google/uuid"
)

type FriendsEntity struct {
	UserAID      uuid.UUID `gorm:"type:uuid;not null"`
	UserBID      uuid.UUID `gorm:"type:uuid;not null"`
	CreationDate time.Time `gorm:"type:timestamp;default:current_timestamp"`

	UserA UserEntity `gorm:"foreignKey:UserAID;constraint:OnDelete:CASCADE"`
	UserB UserEntity `gorm:"foreignKey:UserBID;constraint:OnDelete:CASCADE"`
}
