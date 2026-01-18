package product

import (
	"net/http"
	"strconv"

	"github.com/Tawunchai/learn-golang/config"
	"github.com/Tawunchai/learn-golang/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListProduct(c *gin.Context) {
	var products []entity.Product

	db := config.DB()

	results := db.Preload("Category").Find(&products)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

func UpdateProductByID(c *gin.Context) {
	db := config.DB()
	idStr := c.Param("ProductID")

	if idStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ ProductID"})
		return
	}

	productID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ProductID ต้องเป็นตัวเลข"})
		return
	}

	var product entity.Product
	if err := db.First(&product, uint(productID)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสินค้าที่มี ProductID ดังกล่าว"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการดึงข้อมูล", "details": err.Error()})
		}
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบข้อมูลไม่ถูกต้อง", "details": err.Error()})
		return
	}

	for _, key := range []string{"Category"} {
		delete(updateData, key)
	}

	// อัปเดตข้อมูล
	if err := db.Model(&product).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "อัปเดตข้อมูลไม่สำเร็จ", "details": err.Error()})
		return
	}

	// โหลดข้อมูลใหม่พร้อมความสัมพันธ์
	db.Preload("Category").First(&product)

	c.JSON(http.StatusOK, gin.H{
		"message": "อัปเดตสินค้าสำเร็จ",
		"data": product,
	})
}

func CreateProduct(c *gin.Context) {
	var product entity.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var category entity.Category
	if err := db.First(&category, product.CategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบหมวดหมู่สินค้าที่ระบุ"})
		return
	}

	if err := db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างสินค้าได้"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func DeleteProductByID(c *gin.Context) {
	productID := c.Param("ProductID")

	db := config.DB()

	// ตรวจสอบก่อนว่าสินค้ามีอยู่จริงหรือไม่
	var product entity.Product
	if err := db.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสินค้าที่ต้องการลบ"})
		return
	}

	// ลบสินค้า
	if err := db.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบสินค้าได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "ลบสินค้าสำเร็จ",
		"productID": productID,
	})
}
