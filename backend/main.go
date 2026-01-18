package main

import (
	"net/http"

	"github.com/Tawunchai/learn-golang/config"
	"github.com/Tawunchai/learn-golang/controller/calendar"
	"github.com/Tawunchai/learn-golang/controller/login"
	"github.com/Tawunchai/learn-golang/controller/product"
	"github.com/Tawunchai/learn-golang/controller/profile"
	"github.com/Tawunchai/learn-golang/controller/user"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	config.ConnectionDB()

	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		// login routes
		router.POST("/login", login.AddLogin)
		router.POST("/signup", user.SignUpByUser)

		// user routes
		router.GET("/users", user.ListUsers)
		router.GET("/user/:UserID", user.GetDataByUserID)
		router.PATCH("/update-user/:UserID", user.UpdateUserByID)

		// calendar routes
		router.GET("/calendars", calendar.ListCalendar)
		router.POST("/create-calendar", calendar.PostCalendar)
		router.PUT("/update-calendar/:id", calendar.UpdateCalendar)
		router.DELETE("/delete-calendar/:id", calendar.DeleteCalendar)

		// product routes
		router.GET("/products", product.ListProduct)
		router.PATCH("/update-product/:ProductID", product.UpdateProductByID)
		router.DELETE("/delete-product/:ProductID", product.DeleteProductByID)
		router.POST("/create-products", product.CreateProduct)

		// profile routes example
		r.POST("/create-profiles", profile.CreateProfile)
		r.GET("/profiles", profile.ListProfile)
		r.PUT("/update-profiles/:id", profile.UpdateProfileByID)
		r.DELETE("/delete-profiles/:id", profile.DeleteProfileByID)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
