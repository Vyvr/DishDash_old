package controllers

import (
	"dish-dash/server/controllers/auth"
	"dish-dash/server/controllers/user"
	"dish-dash/server/controllers/post"
)

func Register() {
	// @TODO: register server controllers here
	auth.RegisterServer()
	user.RegisterServer()
	post.RegisterServer()
}
