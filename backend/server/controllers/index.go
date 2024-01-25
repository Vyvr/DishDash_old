package controllers

import (
	"dish-dash/server/controllers/auth"
	"dish-dash/server/controllers/user"
)

func Register() {
	// @TODO: register server controllers here
	auth.Register()
	user.Register()
}
