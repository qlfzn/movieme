# 🎬 Movie Explorer API (Go + TMDB + OpenAI)

A simple **REST API** that allows users to explore movies by genre using the **TMDB API**, and generate **AI summaries** for selected movies.

---

## Features

* **Discover movies by genre**: <br> 
  Users provide a genre name (e.g. `action`, `comedy`), and the API returns movies that match the selected genre.

* **AI-generated movie summary**: <br>
  Users can request an AI-generated summary for any movie returned by the API.

---

## Architecture Overview

```
Client
  |
  v
Golang REST API
  |
  ├── TMDB API (movie discovery)
  └── AI API (movie summaries)
```

---

## API Endpoints

### 1. Get Movies by Genre

```http
GET /movies?genre=action
```

**Response**

```json
{
  "genre": "action",
  "movies": [
    {
      "title": "The Matrix",
      "overview": "Superman, a journalist in Metropolis, embarks on a journey to reconcile his Kryptonian heritage with his human upbringing as Clark Kent.",
      "popularity": 50.8257,
      "release_date": "2025-07-09",
      "rating": 7.402
    },
  ]
}
```

---

### 2. Get AI Summary for a Movie

```http
POST /movies/{movieId}/summary
```

**Response**

```json
{
  "movie_id": 603,
  "summary": "A mind-bending sci-fi action film that explores reality, freedom, and control through the journey of a hacker who uncovers the truth about his world."
}
```

---

## Tech Stack

* **Backend**: Golang
* **Frontend (Demo)**: HTML + JavaScript
* **External APIs**:

  * TMDB API
  * OpenAI API (LLM-based summary generation)

* **Deployment**: AWS
---