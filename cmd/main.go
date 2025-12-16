package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/qlfzn/movieme/cmd/api"
)

func main() { 
	logger := log.New(os.Stdout, "[MOVIEME] ", log.LstdFlags|log.Lshortfile)

	err := godotenv.Load()
	if err != nil {
		logger.Fatalf("error loading .env file: %s", err)
	}

	cfg := api.Config{
		Addr: ":8080",
	}

	app := api.Application{
		Config: cfg,
		Logger: logger,
	}

	r := app.Mount()

	err = app.Run(r)
	if err != nil {
		logger.Fatalf("error running server: %s", err)
	}
}
