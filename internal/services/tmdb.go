package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

// get api key
// create client
// get values and call endpoint
type TMDBClient struct {
	apiKey  string
	baseURL string
	client  *http.Client
}

var genres = map[string]string{
	"Action":          "28",
	"Drama":           "18",
	"Fantasy":         "14",
	"Horror":          "27",
	"Science Fiction": "878",
	"Thriller":        "53",
}

type Movie struct {
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	Popularity  float64 `json:"popularity"`
	ReleaseDate string  `json:"release_date"`
	VoteAverage float64 `json:"vote_average"`
}

type MovieSummaryResponse struct {
	Summary string `json:"summary"`
}

type DiscoverMoviesResponse struct {
	Results []Movie `json:"results"`
}

func NewTMDBClient(apiKey string) *TMDBClient {
	return &TMDBClient{
		apiKey:  apiKey,
		baseURL: "https://api.themoviedb.org/3",
		client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (t *TMDBClient) FetchMovies(ctx context.Context, genre string) ([]Movie, error) {
	if genre == "" {
		return nil, errors.New("genre is empty")
	}

	genID, ok := genres[genre]
	if !ok {
		return nil, errors.New("genre not found")
	}

	u, _ := url.Parse(t.baseURL + "/discover/movie")
	q := u.Query()
	q.Set("include_adult", "false")
	q.Set("language", "en-US")
	q.Set("sort_by", "popularity.desc")
	q.Set("with_genres", genID)
	u.RawQuery = q.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, u.String(), nil)
	if err != nil {
		return nil, err
	}
	// set api key
	req.Header.Set("Authorization", "Bearer "+t.apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := t.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var result DiscoverMoviesResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result.Results, nil
}
