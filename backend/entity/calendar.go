package entity

import (
	"gorm.io/gorm"
	"time"
)

type Calendar struct {
	gorm.Model
	Title       string
	Location    string
	Description string
	StartDate   time.Time
	EndDate     time.Time

	UserID *uint
	User   User `gorm:"foreignKey:UserID"`
}
