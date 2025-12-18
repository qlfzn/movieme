const API_BASE_URL = 'http://localhost:8000/api';

// ===== DOM ELEMENTS =====
const searchForm = document.getElementById('searchForm');
const genreSelect = document.getElementById('genreSelect');
const searchButton = document.getElementById('searchButton');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const emptyMessage = document.getElementById('emptyMessage');
const resultsContainer = document.getElementById('resultsContainer');
const resultsCount = document.getElementById('resultsCount');
const moviesGrid = document.getElementById('moviesGrid');

// ===== UTILITY FUNCTIONS =====

/**
 * Show a specific section and hide others
 */
function showSection(section) {
    loadingMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    emptyMessage.classList.add('hidden');
    resultsContainer.classList.add('hidden');

    section.classList.remove('hidden');
}

/**
 * Format movie runtime (minutes to hours and minutes)
 */
function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

/**
 * Create HTML for a single movie card
 */
function createMovieCard(movie) {
    return `
        <article class="movie-card">
            <div class="movie-header">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.year || 'N/A'}</span>
                    <span>${formatRuntime(movie.runtime)}</span>
                    <span>★ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
            
            <div class="movie-body">
                ${movie.one_liner ? `
                    <p class="movie-summary"><em>"${movie.one_liner}"</em></p>
                ` : ''}
                
                ${movie.ai_summary ? `
                    <p class="movie-summary">${movie.ai_summary}</p>
                ` : ''}
                
                ${movie.vibe && movie.vibe.length > 0 ? `
                    <div class="section-title">Vibe</div>
                    <div class="vibe-tags">
                        ${movie.vibe.map(v => `<span class="vibe-tag">${v}</span>`).join('')}
                    </div>
                ` : ''}
                
                ${movie.watch_if && movie.watch_if.length > 0 ? `
                    <div class="section-title">Watch if</div>
                    <ul class="watch-if-list">
                        ${movie.watch_if.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </article>
    `;
}

/**
 * Render all movies to the grid
 */
function renderMovies(movies) {
    moviesGrid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

// ===== API FUNCTIONS =====

/**
 * Fetch movies from the API
 */
async function fetchMovies(genre) {
    const response = await fetch(`${API_BASE_URL}/discover?genres=${genre}&limit=10`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    
    return await response.json();
}

// ===== EVENT HANDLERS =====

/**
 * Handle form submission
 */
async function handleSearch(event) {
    event.preventDefault();
    
    const genre = genreSelect.value;
    
    if (!genre) {
        return;
    }

    // Show loading state
    showSection(loadingMessage);
    searchButton.disabled = true;

    try {
        // Fetch movies from API
        const data = await fetchMovies(genre);
        
        if (!data.movies || data.movies.length === 0) {
            // No movies found
            showSection(emptyMessage);
            emptyMessage.querySelector('p').textContent = 
                'No movies found for this genre. Try another one!';
        } else {
            // Display results
            renderMovies(data.movies);
            resultsCount.textContent = 
                `Found ${data.movies.length} movie${data.movies.length !== 1 ? 's' : ''}`;
            showSection(resultsContainer);
        }
    } catch (error) {
        // Show error state
        console.error('Error fetching movies:', error);
        showSection(errorMessage);
    } finally {
        // Re-enable button
        searchButton.disabled = false;
    }
}

// ===== INITIALIZATION =====

/**
 * Set up event listeners when page loads
 */
function init() {
    searchForm.addEventListener('submit', handleSearch);
    console.log('MovieMind initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}