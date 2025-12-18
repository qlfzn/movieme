package api

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/qlfzn/movieme/internal/handlers"
)

type Application struct {
	Config Config
	Logger *log.Logger
}

type Config struct {
	Addr string
}

// create HTTP router for api
func (app *Application) Mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
  	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		MaxAge:         300,
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello world!"))
	})

	moviesHandler := handlers.NewHandler()

	r.Route("/api/v1/movies", func(r chi.Router) {
		r.Get("/explore", moviesHandler.GetMoviesByGenre)
		r.Post("/summary", moviesHandler.GetAISummary)
	})

	return r
}

// run server
func (app *Application) Run(h http.Handler) error {
	srv := &http.Server{
		Addr:    app.Config.Addr,
		Handler: h,
	}

	app.Logger.Printf("server has started at http://localhost%s", app.Config.Addr)
	return srv.ListenAndServe()
}
