package api

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
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

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello world!"))
	})

	moviesHandler := handlers.NewHandler()

	r.Route("/api/v1/movies", func(r chi.Router) {
		r.Get("/explore", moviesHandler.GetMoviesByGenre) // get movies by genre & filters
		// r.Get("/summary:id", GetAISummary) // generate AI summary for movie
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
