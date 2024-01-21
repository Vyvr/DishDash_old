# Prerequisites

- [go](https://go.dev/doc/install)
- [air](https://github.com/cosmtrek/air)
- [grcpui](https://github.com/fullstorydev/grpcui/releases)

# How to run

1. Download air, go and grcpui
2. open Docker
3. run `docker-compose up -d`
4. run `air -c .air.gnu.toml` (for macos and linux) or `air -c .air.cygwin.toml` (for windows)
5. run `grpcui --plaintext 127.0.0.1:8080`
