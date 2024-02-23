package auth_service

import (
	"dish-dash/server/entities"
	"dish-dash/server/services/database_service"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
	UserID string `json:"id"`
	jwt.StandardClaims
}

func GenerateJWTToken(user entities.UserEntity) (string, error) {
	JWT_EXPIRES_IN := os.Getenv("JWT_EXPIRES_IN")

	// Convert string to int
	jwtExpiresInDays, err := strconv.Atoi(JWT_EXPIRES_IN)
	if err != nil {
		log.Fatalf("Invalid JWT_EXPIRES_IN value: %v", err)
		return "", err
	}

	expirationTime := time.Now().Add(time.Duration(jwtExpiresInDays) * 24 * time.Hour)

	claims := &CustomClaims{
		UserID: user.Id.String(),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Create JWT string
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func RefreshJWTToken(tokenString string) (*entities.UserEntity, string, error) {
	// Validate the existing token
	userEntity, err := ValidateToken(tokenString)
	if err != nil {
		// The token is invalid or expired
		return nil, "", err
	}

	// Check if the token is nearing expiration - this part is up to your policy
	// For example, refresh the token if it's going to expire in less than a day
	// Generate a new token
	token, err := GenerateJWTToken(*userEntity)
	return userEntity, token, err
}

func ValidateToken(tokenString string) (*entities.UserEntity, error) {
	claims := &CustomClaims{}
	db := database_service.GetDBInstance()
	var userEntity *entities.UserEntity

	// Parse the token
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	// Check if there was a problem parsing the token
	if err != nil {
		return nil, err
	}

	// Check if the token is valid
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	// check expiry of token
	if time.Until(time.Unix(claims.ExpiresAt, 0)) < 0 {
		return nil, fmt.Errorf("token too old")
	}

	// Check if the UserID in the claims matches the provided userId
	if err := db.Where("id = ?", claims.UserID).Find(&userEntity).Error; err != nil {
		return nil, fmt.Errorf("user ID does not match")
	}

	return userEntity, nil
}
