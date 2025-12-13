package services

import (
	"errors"
	"fmt"
)

// get api key
// create client
// get values and call endpoint

type TMDBClient struct {
	apiKey  string
	baseUrl string
}

var genres = map[string]string{
	"Action":          "28",
	"Drama":           "18",
	"Fantasy":         "14",
	"Horror":          "27",
	"Science Fiction": "878",
	"Thriller":        "53",
}

func NewClient(apiKey string) *TMDBClient {
	return &TMDBClient{
		apiKey:  apiKey,
		baseUrl: "https://api.themoviedb.org/3",
	}
}

// get movies based on genre
func (t *TMDBClient) FetchMovies(genre string) {
	// parse genre
	if genre == "" {
		errors.New("genre is empty")
	}

	genId, ok := genres[genre]
	if !ok {
		errors.New("genre not found")
	}

	
	//
}
