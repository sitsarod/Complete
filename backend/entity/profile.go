package entity

import (
	"gorm.io/gorm"
)

type Profile struct {
	gorm.Model
	Profile     string `gorm:"type:longtext"`
}