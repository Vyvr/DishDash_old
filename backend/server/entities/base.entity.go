package entities

import "github.com/google/uuid"

// @TODO: finnish this crap
type BaseEntity struct {
	Id uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
}
