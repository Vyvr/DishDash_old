package registrar_service

import (
	"log"
	"net"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var globalListener net.Listener
var serverInstance *grpc.Server

func InitRegistrar() {
	port := os.Getenv("APP_PORT")
	listener, err := net.Listen("tcp", ":" + port)
	if err != nil {
		log.Fatalln("failed to create listener:", err)
	}

	s := grpc.NewServer()
	reflection.Register(s)

	serverInstance = s
	globalListener = listener
}

func GetListener() net.Listener {
	return globalListener
}

func GetServerInstance() *grpc.Server {
	return serverInstance
}
