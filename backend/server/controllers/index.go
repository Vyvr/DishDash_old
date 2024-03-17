package controllers

import (
	"dish-dash/server/controllers/auth"
	"dish-dash/server/controllers/menu_book_post"
	"dish-dash/server/controllers/post"
	"dish-dash/server/controllers/user"
)

func Register() {
	// @TODO: register server controllers here
	auth.RegisterServer()
	user.RegisterServer()
	post.RegisterServer()
	menu_book_post.RegisterServer()
}
