# Currently making new, better version of the app. Gonna post there a link soon

# Cheatsheet
## proto to frontend:
protoc --proto_path=proto proto/*.proto --grpc-web_out=import_style=typescript,mode=grpcwebtext:../frontend/src/app/pb

protoc --proto_path=proto proto/*.proto --js_out=import_style=commonjs:../frontend/src/app/pb

## run backend:
air -c .air.gnu.toml

## run hosting pictures server
you need python 3

cd backend

python3 -m http.server 8000

## run frontend:
ng serve

## postgress database:
docker compose up

## proxy:
envoy -c envoy.yaml

# Backend

## Prerequisites

- [go](https://go.dev/doc/install)
- [air](https://github.com/cosmtrek/air)
- [grcpui](https://github.com/fullstorydev/grpcui/releases)

## How to run

1. Download air, go and grcpui
2. open Docker
3. run `docker-compose up -d`
4. run `air -c .air.gnu.toml` (for macos and linux) or `air -c .air.cygwin.toml` (for windows)
5. run `grpcui --plaintext 127.0.0.1:8080` (for checking endpoints)

# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

