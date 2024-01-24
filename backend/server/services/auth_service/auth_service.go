package auth_service

import (
	"dish-dash/server/entities"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
    UserID   string `json:"id"`
    Email    string `json:"email"`
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
        UserID:   user.Id.String(),
        Email:    user.Email,
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

func RefreshJWTToken(user entities.UserEntity, tokenString string) (string, error) {
    // Validate the existing token
    claims, err := ValidateToken(tokenString, user.Id.String())
    if err != nil {
        // The token is invalid or expired
        return "", err
    }

    // Check if the token is nearing expiration - this part is up to your policy
    // For example, refresh the token if it's going to expire in less than a day
    if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) < 24*time.Hour {
        // Generate a new token
        return GenerateJWTToken(user)
    }

    // If the token is still valid and not close to expiration, return the current token
    return tokenString, nil
}

func ValidateToken(tokenString string, userId string) (*CustomClaims, error) {
    claims := &CustomClaims{}

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

    // Check if the UserID in the claims matches the provided userId
    if claims.UserID != userId {
        return nil, fmt.Errorf("user ID does not match")
    }

    return claims, nil
}
