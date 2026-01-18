package entity

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name        string
	Brand      string
	Price	   float64
	Description string
	Picture     string `gorm:"type:longtext"`

	CategoryID  uint
	Category    Category `gorm:"foreignKey:CategoryID"`
}