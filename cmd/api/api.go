package api

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
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
