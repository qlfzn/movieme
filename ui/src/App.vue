<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100">
    <!-- Header -->
    <header class="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl font-semibold text-balance bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">Movie Explorer</h1>
        <p class="mt-1 text-sm text-teal-400/70">Discover your next favorite film</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Combined genre selection and submission into single card -->
      <div class="max-w-3xl mx-auto mb-16">
        <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-zinc-700/70 transition-colors">
          <div class="text-center mb-6">
            <h2 class="text-xl font-medium mb-2">Choose Your Genre</h2>
            <p class="text-sm text-zinc-400">Select a genre and discover curated movies</p>
          </div>

          <!-- Genre Selection Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              v-for="genre in genres"
              :key="genre"
              @click="selectedGenre = genre"
              :class="[
                'group relative px-4 py-6 rounded-lg text-sm font-medium transition-all overflow-hidden',
                selectedGenre === genre
                  ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/50 scale-105 border border-teal-500/50'
                  : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600'
              ]"
            >
              <!-- Genre Icon Background -->
              <div class="absolute inset-0 opacity-10 flex items-center justify-center">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <span class="relative">{{ genre }}</span>
            </button>
          </div>

          <!-- Added flex container for Fetch and Reset buttons -->
          <div class="flex gap-3">
            <!-- Fetch Button -->
            <button
              @click="fetchMovies"
              :disabled="!selectedGenre || loading"
              :class="[
                'flex-1 px-6 py-4 font-medium rounded-lg transition-all',
                selectedGenre && !loading
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600 shadow-md shadow-teal-900/30 hover:shadow-lg hover:shadow-teal-900/40'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              ]"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin"></div>
                Loading movies...
              </span>
              <span v-else-if="selectedGenre">
                Explore {{ selectedGenre }} Movies
              </span>
              <span v-else>
                Select a genre to continue
              </span>
            </button>

            <!-- Added Reset Button -->
            <button
              @click="resetSelection"
              :disabled="!selectedGenre && movies.length === 0"
              :class="[
                'px-6 py-4 font-medium rounded-lg transition-all flex items-center gap-2',
                selectedGenre || movies.length > 0
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750 border border-zinc-700 hover:border-teal-700/50'
                  : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-zinc-800'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Added results count and improved grid layout -->
      <div v-if="movies.length > 0" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium">{{ selectedGenre }} Movies</h3>
            <p class="text-sm text-zinc-400 mt-1">
              <span class="text-teal-400 font-medium">{{ movies.length }}</span> 
              {{ movies.length === 1 ? 'movie' : 'movies' }} found
            </p>
          </div>
        </div>

        <!-- Movies Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="movie in movies"
            :key="movie.id"
            class="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-teal-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-950/20"
          >
            <!-- Movie Poster -->
            <div class="aspect-[2/3] bg-zinc-800 relative overflow-hidden">
              <img
                v-if="movie.poster"
                :src="movie.poster"
                :alt="movie.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center text-zinc-600">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>

            <!-- Movie Info -->
            <div class="p-5 space-y-4">
              <div>
                <h3 class="font-semibold text-lg text-balance mb-2 leading-snug">{{ movie.title }}</h3>
                
                <div class="flex items-center gap-3 text-xs text-zinc-400">
                  <span v-if="movie.year" class="flex items-center gap-1">
                    <svg class="w-3 h-3 text-sky-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ movie.year }}
                  </span>
                  <span v-if="movie.rating" class="flex items-center gap-1">
                    <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="text-amber-400/90">{{ movie.rating }}</span>
                  </span>
                </div>
              </div>

              <!-- Improved AI summary button and display -->
              <div class="space-y-3">
                <button
                  v-if="!movie.showingSummary"
                  @click="fetchSummary(movie)"
                  :disabled="movie.loadingSummary"
                  class="w-full px-4 py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 hover:border-teal-700/50 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  <svg v-if="!movie.loadingSummary" class="w-4 h-4 group-hover/btn:text-teal-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div v-else class="w-4 h-4 border-2 border-zinc-600 border-t-teal-400 rounded-full animate-spin"></div>
                  <span>{{ movie.loadingSummary ? 'Generating...' : 'Get AI Summary' }}</span>
                </button>

                <div v-if="movie.showingSummary" class="space-y-3 animate-fadeIn">
                  <div class="p-4 bg-zinc-800/50 border border-zinc-700 rounded-md">
                    <div class="flex items-start gap-2 mb-2">
                      <svg class="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span class="text-xs font-medium text-teal-400/90 uppercase tracking-wide">AI Summary</span>
                    </div>
                    <p class="text-sm text-zinc-300 leading-relaxed text-pretty">
                      {{ movie.summary }}
                    </p>
                  </div>
                  <button
                    @click="movie.showingSummary = false"
                    class="text-xs text-zinc-400 hover:text-teal-400 transition-colors flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hide summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Improved empty states with better messaging -->
      <div v-else-if="hasFetched && !loading" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
          <svg class="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-zinc-300 mb-2">No movies found</h3>
        <p class="text-sm text-zinc-500 mb-6">Try selecting a different genre</p>
        <button
          @click="selectedGenre = null; hasFetched = false"
          class="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-700/50 rounded-md transition-colors"
        >
          Choose another genre
        </button>
      </div>

      <div v-else-if="!selectedGenre && !loading" class="text-center py-24">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
          <svg class="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-zinc-300 mb-2">Start exploring movies</h3>
        <p class="text-sm text-zinc-500">Select a genre above to discover great films</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const USE_MOCK_DATA = true // Set to false to use your real backend

// Available genres
const genres = ref([
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Thriller',
  'Documentary'
])

const selectedGenre = ref(null)
const movies = ref([])
const loading = ref(false)
const hasFetched = ref(false)

// TODO: Replace with your actual backend API endpoints
const API_BASE_URL = 'http://localhost:3000/api' // Update this with your backend URL

const mockMovieData = {
  'Action': [
    {
      id: 1,
      title: 'The Last Stand',
      year: 2023,
      rating: 8.2,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A former special forces operative must protect a small town from a dangerous cartel leader.'
    },
    {
      id: 2,
      title: 'Velocity Rush',
      year: 2024,
      rating: 7.8,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'An underground street racer is forced to work with the FBI to take down an international crime syndicate.'
    },
    {
      id: 3,
      title: 'Iron Protocol',
      year: 2023,
      rating: 8.5,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A team of elite soldiers must prevent a terrorist attack on a global summit.'
    }
  ],
  'Comedy': [
    {
      id: 4,
      title: 'The Misadventures of Bob',
      year: 2024,
      rating: 7.3,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'An ordinary office worker\'s life turns upside down when he accidentally becomes a viral internet sensation.'
    },
    {
      id: 5,
      title: 'Wedding Crashers United',
      year: 2023,
      rating: 6.9,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'Two professional wedding crashers bite off more than they can chew at a billionaire\'s destination wedding.'
    },
    {
      id: 6,
      title: 'Game Night Gone Wrong',
      year: 2024,
      rating: 7.6,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A group of friends\' competitive game night takes a dangerous turn when they become entangled in a real mystery.'
    }
  ],
  'Drama': [
    {
      id: 7,
      title: 'Echoes of Yesterday',
      year: 2023,
      rating: 8.7,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A woman returns to her hometown after 20 years to confront her past and reconnect with her estranged family.'
    },
    {
      id: 8,
      title: 'The Painter\'s Journey',
      year: 2024,
      rating: 8.1,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'An aspiring artist struggles to find his voice while dealing with personal tragedy and artistic doubt.'
    },
    {
      id: 9,
      title: 'Beneath the Surface',
      year: 2023,
      rating: 8.4,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A therapist uncovers dark secrets about her patients that lead her to question her own reality.'
    }
  ],
  'Horror': [
    {
      id: 10,
      title: 'The Haunting of Blackwood Manor',
      year: 2024,
      rating: 7.5,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A family moves into an old mansion only to discover it harbors malevolent spirits with a dark history.'
    },
    {
      id: 11,
      title: 'Silent Screams',
      year: 2023,
      rating: 7.9,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A deaf woman must survive a night of terror when a masked intruder breaks into her isolated home.'
    },
    {
      id: 12,
      title: 'The Ritual',
      year: 2024,
      rating: 8.0,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A group of friends hiking in Scandinavia stumble upon a sinister cult performing ancient rituals.'
    }
  ],
  'Sci-Fi': [
    {
      id: 13,
      title: 'Quantum Paradox',
      year: 2024,
      rating: 8.6,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A physicist discovers a way to communicate with parallel universes, but the consequences are catastrophic.'
    },
    {
      id: 14,
      title: 'Colony Zero',
      year: 2023,
      rating: 7.7,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'The first Mars colony faces extinction when a mysterious disease begins spreading among the settlers.'
    },
    {
      id: 15,
      title: 'Neural Link',
      year: 2024,
      rating: 8.3,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'In a future where memories can be uploaded, a hacker discovers a conspiracy that could control humanity.'
    }
  ],
  'Romance': [
    {
      id: 16,
      title: 'Letters to Paris',
      year: 2023,
      rating: 7.2,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A writer travels to Paris following clues in old love letters, only to find unexpected romance along the way.'
    },
    {
      id: 17,
      title: 'Second Chances',
      year: 2024,
      rating: 7.8,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'High school sweethearts reunite at their 10-year reunion and must decide if love deserves a second chance.'
    },
    {
      id: 18,
      title: 'The Art of Us',
      year: 2023,
      rating: 7.5,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'Two rival art gallery owners fall for each other while competing to acquire a valuable painting.'
    }
  ],
  'Thriller': [
    {
      id: 19,
      title: 'The Vanishing Hour',
      year: 2024,
      rating: 8.4,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A detective races against time to find a serial kidnapper who makes victims disappear without a trace.'
    },
    {
      id: 20,
      title: 'Classified',
      year: 2023,
      rating: 8.1,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A CIA analyst discovers a mole within the agency and must expose them before it\'s too late.'
    },
    {
      id: 21,
      title: 'Edge of Truth',
      year: 2024,
      rating: 7.9,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'A defense attorney takes on a high-profile case that puts her own life in danger as she uncovers the truth.'
    }
  ],
  'Documentary': [
    {
      id: 22,
      title: 'Ocean\'s Last Stand',
      year: 2024,
      rating: 8.9,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'An in-depth look at the urgent fight to save the world\'s dying coral reefs and marine ecosystems.'
    },
    {
      id: 23,
      title: 'The Innovation Revolution',
      year: 2023,
      rating: 8.2,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'Exploring how breakthrough technologies are reshaping industries and transforming human society.'
    },
    {
      id: 24,
      title: 'Voices Unheard',
      year: 2024,
      rating: 8.6,
      poster: '/placeholder.svg?height=450&width=300',
      plot: 'Personal stories from marginalized communities fighting for equality and social justice around the world.'
    }
  ]
}

const mockSummaries = [
  "This gripping film masterfully blends intense action sequences with compelling character development. The cinematography captures both intimate moments and explosive set pieces with equal skill, while the score heightens the emotional impact throughout. The performances are uniformly excellent, bringing depth to what could have been one-dimensional roles.",
  "A thought-provoking exploration of its themes that doesn't shy away from complexity. The director's vision is clear and purposeful, creating a cohesive narrative that builds to a satisfying conclusion. The supporting cast delivers nuanced performances that complement the leads perfectly, creating a rich tapestry of human emotion.",
  "An entertaining entry in its genre that delivers exactly what audiences expect while adding fresh perspectives. The pacing is tight, keeping viewers engaged from start to finish. The production design creates an immersive world that feels both authentic and stylized. A solid achievement that respects its audience's intelligence.",
  "This film stands out for its innovative approach to familiar material. The screenplay is sharp and witty, with dialogue that crackles with energy. The lead performances are magnetic, drawing viewers into the story's emotional core. Technical aspects from editing to sound design are top-notch, creating a polished final product.",
  "A visually stunning achievement that pushes the boundaries of its genre. The narrative structure keeps audiences guessing while maintaining emotional clarity. The ensemble cast works together seamlessly, creating believable relationships and dynamics. The climax is both surprising and inevitable, a mark of excellent storytelling."
]

const fetchMovies = async () => {
  if (!selectedGenre.value) return
  
  loading.value = true
  movies.value = []
  hasFetched.value = true

  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockMovies = mockMovieData[selectedGenre.value] || []
    movies.value = mockMovies.map(movie => ({
      ...movie,
      showingSummary: false,
      loadingSummary: false,
      summary: null,
      details: movie
    }))
    
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/movies?genre=${encodeURIComponent(selectedGenre.value)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }

    const data = await response.json()
    
    // Map backend response: original_title, overview, popularity, release_date, vote_average
    movies.value = data.map((movie, index) => ({
      id: index + 1, // Use index as ID if backend doesn't provide one
      title: movie.original_title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      poster: '/placeholder.svg?height=450&width=300', // Use placeholder or add poster_path if available
      plot: movie.overview,
      showingSummary: false,
      loadingSummary: false,
      summary: null,
      details: movie // Store full movie object for AI summary
    }))
  } catch (error) {
    console.error('Error fetching movies:', error)
  } finally {
    loading.value = false
  }
}

const fetchSummary = async (movie) => {
  movie.loadingSummary = true

  if (USE_MOCK_DATA) {
    // Simulate AI API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)]
    movie.summary = randomSummary
    movie.showingSummary = true
    movie.loadingSummary = false
    return
  }

  try {
    // Replace with your actual endpoint
    // TODO: Adjust the request body based on what your backend expects
    const response = await fetch(`${API_BASE_URL}/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        year: movie.year,
        plot: movie.plot,
        ...movie.details
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch summary')
    }

    const data = await response.json()
    
    // Adjust this based on your actual API response structure
    movie.summary = data.summary || data.text || 'No summary available'
    movie.showingSummary = true
  } catch (error) {
    console.error('Error fetching summary:', error)
    movie.summary = 'Failed to load summary. Please try again.'
    movie.showingSummary = true
  } finally {
    movie.loadingSummary = false
  }
}

const resetSelection = () => {
  selectedGenre.value = null
  movies.value = []
  hasFetched.value = false
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
