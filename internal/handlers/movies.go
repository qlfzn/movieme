package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/qlfzn/movieme/internal/services"
)

// this file include:
// HTTP handler to receive and response, get movies from API, and generate AI summary

type Handler struct {
	serviceClient *services.TMDBClient
}

func NewHandler() *Handler{
	return &Handler{
		serviceClient: services.NewClient(os.Getenv("TMDB_API_KEY")),
	}
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

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	results, err := h.serviceClient.FetchMovies(ctx, params.Genre)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
        return
	}

	w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(results)
}