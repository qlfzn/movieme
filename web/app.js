const API_BASE = "";

// These must match the genre keys defined in the Go backend exactly.
const GENRES = [
  "Action",
  "Drama",
  "Fantasy",
  "Horror",
  "Science Fiction",
  "Thriller",
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const genreListEl = document.getElementById("genre-list");
const movieGridEl = document.getElementById("movie-grid");
const moviesMetaEl = document.getElementById("movies-meta");
const emptyStateEl = document.getElementById("empty-state");
const errorStateEl = document.getElementById("error-state");
const errorMessageEl = document.getElementById("error-message");

let activeGenre = null;

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderGenres();
});

// ─── Genre buttons ────────────────────────────────────────────────────────────
function renderGenres() {
  GENRES.forEach((genre) => {
    const btn = document.createElement("button");
    btn.className = "genre-btn";
    btn.textContent = genre;
    btn.setAttribute("data-genre", genre);
    btn.addEventListener("click", () => selectGenre(genre));
    genreListEl.appendChild(btn);
  });
}

function setActiveGenreButton(genre) {
  genreListEl.querySelectorAll(".genre-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.genre === genre);
  });
}

// ─── Fetch + render movies ────────────────────────────────────────────────────
async function selectGenre(genre) {
  if (activeGenre === genre) return;
  activeGenre = genre;

  setActiveGenreButton(genre);
  hideError();
  renderSkeletons();
  moviesMetaEl.textContent = "";

  try {
    const res = await fetch(
      `${API_BASE}/api/v1/movies/explore?genre=${encodeURIComponent(genre)}`
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `Server error: ${res.status}`);
    }

    const movies = await res.json();
    renderMovies(movies, genre);
  } catch (err) {
    clearGrid();
    showError("Could not load movies. Make sure the server is running.");
    console.error(err);
  }
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function renderSkeletons() {
  movieGridEl.innerHTML = "";
  emptyStateEl.classList.add("hidden");

  for (let i = 0; i < 8; i++) {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.innerHTML = `
      <div class="skeleton-line skeleton-poster"></div>
      <div class="skeleton-body">
        <div class="skeleton-line" style="height:15px; width:72%"></div>
        <div class="skeleton-line" style="height:10px; width:36%"></div>
        <div class="skeleton-line" style="height:10px; width:100%; margin-top:4px"></div>
        <div class="skeleton-line" style="height:10px; width:90%"></div>
        <div class="skeleton-line" style="height:10px; width:76%"></div>
      </div>
    `;
    movieGridEl.appendChild(card);
  }
}

// ─── Movie cards ──────────────────────────────────────────────────────────────
function renderMovies(movies, genre) {
  clearGrid();

  if (!movies || movies.length === 0) {
    moviesMetaEl.textContent = `No results for "${genre}"`;
    emptyStateEl.classList.remove("hidden");
    movieGridEl.appendChild(emptyStateEl);
    return;
  }

  moviesMetaEl.textContent = `${movies.length} films — ${genre}`;

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    movieGridEl.appendChild(card);
  });
}

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w342";

function createMovieCard(movie) {
  const year = formatYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const posterUrl = movie.poster_path
    ? `${TMDB_IMG_BASE}${movie.poster_path}`
    : null;

  const card = document.createElement("div");
  card.className = "movie-card";

  const posterHtml = posterUrl
    ? `<div class="card-poster">
        <img src="${posterUrl}" alt="${escapeHtml(movie.title)} poster" loading="lazy" />
       </div>`
    : `<div class="card-poster card-poster--missing"><span>No image</span></div>`;

  card.innerHTML = `
    ${posterHtml}
    <div class="card-body">
      <div>
        <h2 class="card-title">${escapeHtml(movie.title)}</h2>
      </div>
      <div class="card-meta">
        <span class="year">${year}</span>
        <span class="dot">·</span>
        <span class="rating">
          ${rating}
          <span class="rating-source">TMDb</span>
        </span>
      </div>
      <p class="card-overview">${escapeHtml(movie.overview || "No overview available.")}</p>
      <div class="card-footer"></div>
    </div>
  `;

  const footer = card.querySelector(".card-footer");
  const pitchBtn = document.createElement("button");
  pitchBtn.className = "btn-pitch";
  pitchBtn.textContent = "Get AI pitch";
  pitchBtn.addEventListener("click", () => fetchSummary(movie, footer, pitchBtn));
  footer.appendChild(pitchBtn);

  return card;
}

// ─── AI summary ───────────────────────────────────────────────────────────────
async function fetchSummary(movie, footerEl, btn) {
  btn.disabled = true;
  footerEl.innerHTML = `
    <div class="card-loading">
      <span class="spinner"></span>
      <span>Generating pitch&hellip;</span>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE}/api/v1/movies/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `Server error: ${res.status}`);
    }

    const data = await res.json();
    renderPitch(footerEl, data.summary);
  } catch (err) {
    footerEl.innerHTML = `<span style="font-size:0.8rem; color:#c0504a;">Failed to generate pitch.</span>`;
    console.error(err);
  }
}

function renderPitch(footerEl, summary) {
  footerEl.innerHTML = `
    <div class="ai-pitch">
      <div class="ai-pitch-label">AI pitch</div>
      <p class="ai-pitch-text">${escapeHtml(summary)}</p>
    </div>
  `;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatYear(dateStr) {
  if (!dateStr) return "—";
  return dateStr.slice(0, 4);
}

function formatRating(rating) {
  if (!rating) return "N/A";
  return rating.toFixed(1);
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function clearGrid() {
  movieGridEl.innerHTML = "";
  emptyStateEl.classList.add("hidden");
}

function showError(msg) {
  errorMessageEl.textContent = msg;
  errorStateEl.classList.remove("hidden");
}

function hideError() {
  errorStateEl.classList.add("hidden");
  errorMessageEl.textContent = "";
}
