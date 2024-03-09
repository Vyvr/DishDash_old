package database_service

import (
	"dish-dash/server/entities"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var dbInstance *gorm.DB

func InitDatabase() error {
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB_NAME")
	host := os.Getenv("POSTGRES_HOST")

	dsn := "host=" + host + " user=" + user + " password=" + password + " dbname=" + dbname + " sslmode=disable TimeZone=Europe/Warsaw"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")

	autoMigrate(db)
	dbInstance = db
	return nil
}

func GetDBInstance() *gorm.DB {
	return dbInstance
}

func autoMigrate(db *gorm.DB) {
	// @TODO: add new entities as you go here
	db.AutoMigrate(&entities.UserEntity{})
	db.AutoMigrate(&entities.PostEntity{})
	db.AutoMigrate(&entities.PostPicturesEntity{})
	db.AutoMigrate(&entities.FriendsEntity{})
	db.AutoMigrate(&entities.PostLikesEntity{})
	db.AutoMigrate(&entities.PostCommentsEntity{})
}
