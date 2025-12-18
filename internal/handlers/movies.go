package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/qlfzn/movieme/internal/services"
)

// this file include:
// HTTP handler to receive and response, get movies from API, and generate AI summary

type Handler struct {
	serviceClient *services.TMDBClient
	aiClient      openai.Client
}

func NewHandler() *Handler {
	return &Handler{
		serviceClient: services.NewTMDBClient(os.Getenv("TMDB_API_KEY")),
		aiClient:      services.NewAIClient(os.Getenv("OPENAI_API_KEY")),
	}
}

type MovieParams struct {
	Genre string
	Cast  []string
}

// get movies based on genre
func (h Handler) GetMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	// parse request
	genre := r.URL.Query().Get("genre")

	params := MovieParams{
		Genre: genre,
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
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

// get AI summary for given movie
func (h Handler) GetAISummary(w http.ResponseWriter, r *http.Request) {
	// parse request
	var req services.Movie
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	summary, err := services.GenerateSummary(ctx, h.aiClient, services.Movie{
		Title:       req.Title,
		Overview:    req.Overview,
		ReleaseDate: req.ReleaseDate,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := services.MovieSummaryResponse{
		Summary: summary,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}
