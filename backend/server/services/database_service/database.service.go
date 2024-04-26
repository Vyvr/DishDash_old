package database_service

import (
	"dish-dash/server/entities"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"
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
	db.AutoMigrate(&entities.PostInMenuBookEntity{})
	db.AutoMigrate(&entities.PostPicturesEntity{})
	db.AutoMigrate(&entities.FriendsEntity{})
	db.AutoMigrate(&entities.PostLikesEntity{})
	db.AutoMigrate(&entities.PostCommentsEntity{})
}

func FillDatabase() {
	dsn := "host=localhost user=gorm password=gorm dbname=dish-dash port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Get the current working directory.
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get current working directory:", err)
	}
	log.Println("Current working directory:", cwd)

	// Construct the path to the data.json file.
	filePath := cwd + "/server/services/database_service/data.json"

	// Read the JSON data from the file.
	jsonData, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatalf("Failed to read the JSON file from path %s: %v", filePath, err)
	}

	// Decode the JSON data into your entities
	var data struct {
		Users    []entities.UserEntity
		Posts    []entities.PostEntity
		Friends  []entities.FriendsEntity
		Comments []entities.PostCommentsEntity
		Likes    []entities.PostLikesEntity
	}

	// Get the current year
	currentYear := time.Now().Year()

	// Create a random number generator with a seed based on current time
	rand.Seed(time.Now().UnixNano())

	// Generate a random day of the year
	start := time.Date(currentYear, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(currentYear+1, 1, 0, 0, 0, 0, 0, time.UTC)

	if err := json.Unmarshal(jsonData, &data); err != nil {
		log.Fatal("Failed to decode JSON data:", err)
	}

	// Insert the data into the database
	// Start by inserting users
	for _, user := range data.Users {
		var pass, err = bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Println("Error in hashing password:", err)
		}

		user.Password = string(pass)

		if err := db.Create(&user).Error; err != nil {
			log.Println("Failed to insert user:", err)
		}
	}

	// // Insert posts
	for _, post := range data.Posts {
		post.CreationDate = start.Add(time.Duration(rand.Intn(int(end.Sub(start).Seconds()))) * time.Second)
		if err := db.Create(&post).Error; err != nil {
			log.Println("Failed to insert post:", err)
		}
	}

	// // Insert friends
	for _, friend := range data.Friends {
		friend.CreationDate = start.Add(time.Duration(rand.Intn(int(end.Sub(start).Seconds()))) * time.Second)
		if err := db.Create(&friend).Error; err != nil {
			log.Println("Failed to insert friend relationship:", err)
		}
	}

	// // Insert comments
	for _, comment := range data.Comments {
		comment.CreationDate = start.Add(time.Duration(rand.Intn(int(end.Sub(start).Seconds()))) * time.Second)
		if err := db.Create(&comment).Error; err != nil {
			log.Println("Failed to insert comment:", err)
		}
	}

	// // Insert likes
	for _, like := range data.Likes {
		like.CreationDate = start.Add(time.Duration(rand.Intn(int(end.Sub(start).Seconds()))) * time.Second)
		if err := db.Create(&like).Error; err != nil {
			log.Println("Failed to insert like:", err)
		}
	}

	for _, post := range data.Posts {
		var postEntity entities.PostEntity
		err = db.Where("id = ?", post.Id).First(&postEntity).Error
		if err != nil {
			log.Println("Failed find post to like:", err)
		}

		var likesCount int64
		if err := db.Model(&entities.PostLikesEntity{}).Where("post_id = ?", postEntity.Id).Count(&likesCount).Error; err != nil {
			log.Fatal("Failed to count likes:", err)
		}

		var commentsCount int64
		if err := db.Model(&entities.PostCommentsEntity{}).Where("post_id = ?", postEntity.Id).Count(&commentsCount).Error; err != nil {
			log.Fatal("Failed to count comments:", err)
		}

		postEntity.LikesCount = likesCount
		postEntity.CommentsCount = commentsCount

		err = db.Model(&entities.PostEntity{}).Where("id = ?", postEntity.Id).Updates(map[string]interface{}{
			"likes_count":    postEntity.LikesCount,
			"comments_count": postEntity.CommentsCount,
		}).Error
		if err != nil {
			log.Fatal("Failed to update post comments and likes:", err)
		}

	}

	fmt.Println("Database initialization complete.")
}
