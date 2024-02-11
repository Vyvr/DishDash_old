package entities

import (
	"time"
)

// @TODO: finnish this crap
type PostEntity struct {
	BaseEntity
	OwnerId         string    `gorm:"type:uuid"`
	OwnerName		string    `gorm:"type:text"`
	OwnerSurname	string    `gorm:"type:text"`
	Title           string    `gorm:"type:text"`
	Ingredients     string    `gorm:"type:text"`
	PortionQuantity int       `gorm:"type:integer"`
	Preparation     string    `gorm:"type:text"`
	Pictures        []string  `gorm:"type:text[]"`
	CreationDate    time.Time `gorm:"type:timestamp;default:current_timestamp"`
}