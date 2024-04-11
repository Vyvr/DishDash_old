package entities

// @TODO: finnish this crap
type UserEntity struct {
	BaseEntity
	Email       string `gorm:"not null;uniqe"`
	Name        string `gorm:"not null"`
	Surname     string `gorm:"not null"`
	Password    string `gorm:"not null"`
	Description string
	Token       string
	PicturePath string
}
