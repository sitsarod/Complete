package login

import (
	"net/http"

	"github.com/Tawunchai/learn-golang/config"
	"github.com/Tawunchai/learn-golang/entity"
	"github.com/Tawunchai/learn-golang/services"
	"github.com/gin-gonic/gin"
)

func AddLogin(c *gin.Context) {
	var loginData entity.User
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	db := config.DB()

	var user entity.User
	if err := db.Preload("Role").Preload("Position").
		Where("email = ?", loginData.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !config.CheckPasswordHash([]byte(loginData.Password), []byte(user.Password)) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "RhE9Q6zyV8Ai5jnPq2ZDsXMmLuy5eNkw",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(user.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type": "Bearer",
		"token":      signedToken,
		"Role":       user.Role,
		"UserID":    user.ID,
		"FirstName":  user.FirstName,
		"LastName":   user.LastName,
		"Email":      user.Email,
		"Position":   user.Position,
	})
}
