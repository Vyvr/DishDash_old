package main

import (
	"dish-dash/server/controllers"
	"dish-dash/server/services/database_service"
	"dish-dash/server/services/registrar_service"
	"log"

	// "dish-dash/server/services/socket_service"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env.local"); err != nil {
		log.Fatalln("couldnt load env file:", err)
	}

	registrar_service.InitRegistrar()

	if err := database_service.InitDatabase(); err != nil {
		log.Fatalln("failed to create database driver instance:", err)
	}

	// database_service.FillDatabase()

	controllers.Register()

	// go socket_service.InitSocketServer()

	if err := registrar_service.GetServerInstance().Serve(registrar_service.GetListener()); err != nil {
		log.Fatalln("failed to serve:", err)
	}
}
