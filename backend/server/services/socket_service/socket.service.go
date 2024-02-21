package socket_service

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	// "github.com/googollee/go-socket.io/engineio"
	// "github.com/googollee/go-socket.io/engineio/transport"
	// "github.com/googollee/go-socket.io/engineio/transport/polling"
	// "github.com/googollee/go-socket.io/engineio/transport/websocket"
)

func InitSocketServer() {
	// port := os.Getenv("SOCKET_PORT")

	// server := socketio.NewServer(&engineio.Options{
	// 	Transports: []transport.Transport{
	// 		&polling.Transport{
	// 			CheckOrigin: func(r *http.Request) bool {
	// 				return true // Allow all origins
	// 			},
	// 		},
	// 		&websocket.Transport{},
	// 	},
	// })

	server := socketio.NewServer(nil)

	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "message", func(s socketio.Conn, msg string) {
		log.Println("message:", msg)
		s.Emit("reply", "have "+msg)
	})

	server.OnEvent("/", "friend-request", func(s socketio.Conn, msg string) {
		fmt.Println("notice:", msg)
		s.Emit("message", "have "+msg)
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		// server.Remove(s.ID())
		fmt.Println("meet error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		// Add the Remove session id. Fixed the connection & mem leak
		fmt.Println("closed", reason)
	})

	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	log.Println("Serving at localhost:8083...")
	log.Fatal(http.ListenAndServe(":8083", nil))
}
