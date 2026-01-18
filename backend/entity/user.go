package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName   string
	LastName    string 
    Email 	    string       
	PhoneNumber		string
	Password    string
	Profile string `gorm:"type:longtext"`
		
	RoleID	uint
	Role	*Role `gorm:"foreignKey: RoleID"`

    PositionID	uint
	Position	*Position `gorm:"foreignKey: PositionID"`

	Calendar []Calendar `gorm:"foreignKey: UserID"`
}