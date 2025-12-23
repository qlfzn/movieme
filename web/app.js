// ===== CONFIGURATION =====
const API_BASE_URL = 'http://localhost:8080/api/v1/movies';

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
 * Extract year from release_date
 */
function extractYear(releaseDate) {
    if (!releaseDate) return 'N/A';
    return releaseDate.split('-')[0];
}

/**
 * Format popularity score
 */
function formatPopularity(popularity) {
    if (!popularity) return 'N/A';
    if (popularity >= 1000) {
        return `${(popularity / 1000).toFixed(1)}K`;
    }
    return Math.round(popularity).toString();
}

/**
 * Create HTML for a single movie card
 */
function createMovieCard(movie) {
    const year = extractYear(movie.release_date);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const popularity = formatPopularity(movie.popularity);
    
    return `
        <article class="movie-card">
            <div class="movie-header">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${year}</span>
                    <span>★ ${rating}</span>
                    <span>${popularity} views</span>
                </div>
            </div>
            
            <div class="movie-body">
                ${movie.overview ? `
                    <p class="movie-summary">${movie.overview}</p>
                ` : ''}
                
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
    const response = await fetch(`${API_BASE_URL}/explore?genre=${genre}&limit=10`);
    console.log(response)
    
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

        console.log(`Data: `, data)
        
        if (!data || data.length === 0) {
            // No movies found
            showSection(emptyMessage);
            emptyMessage.querySelector('p').textContent = 
                'No movies found for this genre. Try another one!';
        } else {
            // Display results
            renderMovies(data);
            resultsCount.textContent = 
                `Found ${data.length} movie${data.length !== 1 ? 's' : ''}`;
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