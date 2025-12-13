package handlers

import "net/http"

// this file include:
// HTTP handler to receive and response, get movies from API, and generate AI summary

type Handler struct {}

func NewHandler() {
	return &Handler{}
}

type MovieParams struct {
	Genre string
	Cast []string
}

// get movies based on genre
func (h Handler) GetMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	// parse request
	genre := r.URL.Query().Get("genre")

	params := MovieParams{
		Genre: genre,
	}

	// pass params to service
	results := 
}