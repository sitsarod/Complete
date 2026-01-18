package profile

import (
	"net/http"
	"strconv"

	"github.com/Tawunchai/learn-golang/config"
	"github.com/Tawunchai/learn-golang/entity"
	"github.com/gin-gonic/gin"
)

// ✅ CreateProfile
func CreateProfile(c *gin.Context) {
	var profile entity.Profile

	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	if err := db.Create(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างโปรไฟล์ได้"})
		return
	}

	c.JSON(http.StatusCreated, profile)
}

// ✅ UpdateProfileByID
func UpdateProfileByID(c *gin.Context) {
	id := c.Param("id")
	profileID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID ไม่ถูกต้อง"})
		return
	}

	db := config.DB()

	var profile entity.Profile
	if err := db.First(&profile, profileID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบโปรไฟล์ที่ต้องการแก้ไข"})
		return
	}

	var input entity.Profile
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile.Profile = input.Profile

	if err := db.Save(&profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตโปรไฟล์ได้"})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// ✅ DeleteProfileByID
func DeleteProfileByID(c *gin.Context) {
	id := c.Param("id")
	profileID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID ไม่ถูกต้อง"})
		return
	}

	db := config.DB()

	if err := db.Delete(&entity.Profile{}, profileID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบโปรไฟล์ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบโปรไฟล์สำเร็จ"})
}

// ✅ ListProfile
func ListProfile(c *gin.Context) {
	var profiles []entity.Profile

	db := config.DB()
	if err := db.Find(&profiles).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลโปรไฟล์"})
		return
	}

	c.JSON(http.StatusOK, profiles)
}
