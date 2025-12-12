package main

import (
	"log"
	"os"

	"github.com/qlfzn/movieme/cmd/api"
)

func main() {
	logger := log.New(os.Stdout, "[MovieMe] ", log.LstdFlags|log.Lshortfile)


	cfg := api.Config{
		Addr: ":8080",
	}


	app := api.Application{
		Config: cfg,
		Logger: logger,
	}

	r := app.Mount()

	err := app.Run(r)
	if err != nil {
		logger.Fatalf("error running server: %s", err)
	}
}
