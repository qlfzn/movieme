const API_BASE = "";
const TMDB_IMG_BASE  = "https://image.tmdb.org/t/p/w342";
const TMDB_IMG_LARGE = "https://image.tmdb.org/t/p/w500";

// These must match the genre keys defined in the Go backend exactly.
const GENRES = [
  { name: "Action",          mood: "fast-paced, high stakes" },
  { name: "Drama",           mood: "grounded, emotional" },
  { name: "Fantasy",         mood: "otherworldly, imaginative" },
  { name: "Horror",          mood: "tense, unsettling" },
  { name: "Science Fiction", mood: "big ideas, distant worlds" },
  { name: "Thriller",        mood: "suspenseful, edge-of-seat" },
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
  GENRES.forEach(({ name, mood }) => {
    const btn = document.createElement("button");
    btn.className = "genre-btn";
    btn.setAttribute("data-genre", name);
    btn.innerHTML = `
      <span class="genre-name">${name}</span>
      <span class="genre-mood">${mood}</span>
    `;
    btn.addEventListener("click", () => selectGenre(name));
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

  // One wide spotlight skeleton
  const spotSkel = document.createElement("div");
  spotSkel.className = "skeleton-card skeleton-spotlight";
  spotSkel.innerHTML = `
    <div class="skeleton-line" style="width:210px;min-width:210px;height:100%;min-height:300px;border-radius:0;flex-shrink:0"></div>
    <div class="skeleton-body" style="flex:1;padding:24px;display:flex;flex-direction:column;gap:14px">
      <div class="skeleton-line" style="height:11px;width:14%"></div>
      <div class="skeleton-line" style="height:24px;width:60%"></div>
      <div class="skeleton-line" style="height:10px;width:28%"></div>
      <div class="skeleton-line" style="height:10px;width:100%;margin-top:8px"></div>
      <div class="skeleton-line" style="height:10px;width:94%"></div>
      <div class="skeleton-line" style="height:10px;width:82%"></div>
      <div class="skeleton-line" style="height:10px;width:68%"></div>
    </div>
  `;
  movieGridEl.appendChild(spotSkel);

  // Five regular card skeletons
  for (let i = 0; i < 5; i++) {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.innerHTML = `
      <div class="skeleton-line skeleton-poster"></div>
      <div class="skeleton-body">
        <div class="skeleton-line" style="height:15px;width:72%"></div>
        <div class="skeleton-line" style="height:10px;width:36%"></div>
        <div class="skeleton-line" style="height:10px;width:100%;margin-top:4px"></div>
        <div class="skeleton-line" style="height:10px;width:90%"></div>
        <div class="skeleton-line" style="height:10px;width:76%"></div>
      </div>
    `;
    movieGridEl.appendChild(card);
  }
}

// ─── Movie list ───────────────────────────────────────────────────────────────
function renderMovies(movies, genre) {
  clearGrid();

  if (!movies || movies.length === 0) {
    moviesMetaEl.textContent = `No results for "${genre}"`;
    emptyStateEl.classList.remove("hidden");
    movieGridEl.appendChild(emptyStateEl);
    return;
  }

  const picks = movies.slice(0, 6);
  moviesMetaEl.textContent = `Top ${picks.length} picks — ${genre}`;

  // First result gets the spotlight
  movieGridEl.appendChild(createSpotlightCard(picks[0]));

  // Remaining 5 get regular cards
  picks.slice(1).forEach((movie) => {
    movieGridEl.appendChild(createMovieCard(movie));
  });
}

// ─── Spotlight card (top pick, auto-fetches AI pitch) ────────────────────────
function createSpotlightCard(movie) {
  const year      = formatYear(movie.release_date);
  const rating    = formatRating(movie.vote_average);
  const posterUrl = movie.poster_path ? `${TMDB_IMG_LARGE}${movie.poster_path}` : null;

  const card = document.createElement("div");
  card.className = "movie-card spotlight-card";

  const posterHtml = posterUrl
    ? `<div class="spotlight-poster">
         <img src="${posterUrl}" alt="${escapeHtml(movie.title)} poster" loading="eager" />
       </div>`
    : `<div class="spotlight-poster spotlight-poster--missing"><span>No image</span></div>`;

  card.innerHTML = `
    ${posterHtml}
    <div class="spotlight-body">
      <div class="spotlight-badge">Top Pick</div>
      <h2 class="spotlight-title">${escapeHtml(movie.title)}</h2>
      <div class="card-meta">
        <span class="year">${year}</span>
        <span class="dot">·</span>
        <span class="rating">
          ${rating}
          <span class="rating-source">TMDb</span>
        </span>
      </div>
      <p class="spotlight-overview">${escapeHtml(movie.overview || "No overview available.")}</p>
      <div class="spotlight-pitch-area">
        <div class="card-loading">
          <span class="spinner"></span>
          <span>Generating pitch&hellip;</span>
        </div>
      </div>
    </div>
  `;

  // Auto-fetch AI pitch — no button needed for the top pick
  const pitchArea = card.querySelector(".spotlight-pitch-area");
  fetchSummaryInto(movie, pitchArea);

  return card;
}

// ─── Regular movie card ───────────────────────────────────────────────────────
function createMovieCard(movie) {
  const year      = formatYear(movie.release_date);
  const rating    = formatRating(movie.vote_average);
  const posterUrl = movie.poster_path ? `${TMDB_IMG_BASE}${movie.poster_path}` : null;

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
      <h2 class="card-title">${escapeHtml(movie.title)}</h2>
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

  const footer   = card.querySelector(".card-footer");
  const pitchBtn = document.createElement("button");
  pitchBtn.className   = "btn-pitch";
  pitchBtn.textContent = "What's the pitch?";
  pitchBtn.addEventListener("click", () => {
    pitchBtn.remove();
    footer.innerHTML = `
      <div class="card-loading">
        <span class="spinner"></span>
        <span>Generating pitch&hellip;</span>
      </div>
    `;
    fetchSummaryInto(movie, footer);
  });
  footer.appendChild(pitchBtn);

  return card;
}

// ─── AI summary (shared) ──────────────────────────────────────────────────────
async function fetchSummaryInto(movie, containerEl) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/movies/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:        movie.title,
        overview:     movie.overview,
        release_date: movie.release_date,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `Server error: ${res.status}`);
    }

    const data = await res.json();
    containerEl.innerHTML = `
      <div class="ai-pitch">
        <div class="ai-pitch-label">AI pitch</div>
        <p class="ai-pitch-text">${escapeHtml(data.summary)}</p>
      </div>
    `;
  } catch (err) {
    containerEl.innerHTML = `<span style="font-size:0.8rem;color:#c0504a;">Failed to generate pitch.</span>`;
    console.error(err);
  }
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
  errorMsgEl.textContent = msg;
  errorStateEl.classList.remove("hidden");
}

function hideError() {
  errorStateEl.classList.add("hidden");
  errorMsgEl.textContent = "";
}
