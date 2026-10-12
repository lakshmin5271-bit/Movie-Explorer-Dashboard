import React, { useState } from 'react';
import Header from './Header.jsx';
import MovieList from './MovieList.jsx';
import MovieDetails from './MovieDetails.jsx';
import BookingModal from './BookingModal.jsx';
import './App.css';

// Initial dataset of 8 iconic Kannada and Telugu movie objects
// Helper: compute average rating from reviews array
const calcAvgRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

// Helper: build showtimes for a movie with given pre-booked seats count per show
const makeShowtimes = (movieId, price, preBooked) => [
  { id: `${movieId}-s1`, date: 'Today',    time: '10:00 AM', totalSeats: 50, bookedSeats: Array.from({ length: preBooked[0] }, (_, i) => i + 1), price },
  { id: `${movieId}-s2`, date: 'Today',    time: '02:00 PM', totalSeats: 50, bookedSeats: Array.from({ length: preBooked[1] }, (_, i) => i + 1), price },
  { id: `${movieId}-s3`, date: 'Today',    time: '06:30 PM', totalSeats: 50, bookedSeats: Array.from({ length: preBooked[2] }, (_, i) => i + 1), price },
  { id: `${movieId}-s4`, date: 'Tomorrow', time: '11:00 AM', totalSeats: 50, bookedSeats: Array.from({ length: preBooked[3] }, (_, i) => i + 1), price },
  { id: `${movieId}-s5`, date: 'Tomorrow', time: '07:00 PM', totalSeats: 50, bookedSeats: Array.from({ length: preBooked[4] }, (_, i) => i + 1), price },
];

const INITIAL_MOVIES = [
  {
    id: 1,
    title: 'Kantara',
    genre: 'Thriller',
    language: 'Kannada',
    year: 2022,
    description: 'When greed paves the way for betrayal and conflict, a fiery young villager in Coastal Karnataka honors the divine woodland spirits of his ancestors to protect his community.',
    isFavorite: true,
    showtimes: makeShowtimes(1, 180, [42, 50, 28, 15, 50]),
    reviews: [
      { id: 'r1', user: 'Arjun M.', stars: 9 },
      { id: 'r2', user: 'Priya K.', stars: 8 },
      { id: 'r3', user: 'Vikram S.', stars: 8 },
    ],
  },
  {
    id: 2,
    title: 'RRR',
    genre: 'Action',
    language: 'Telugu',
    year: 2022,
    description: 'A tale of two legendary revolutionaries—Alluri Sitarama Raju and Komaram Bheem—who form an unbreakable friendship and fight back against the tyrannical British crown.',
    isFavorite: true,
    showtimes: makeShowtimes(2, 200, [50, 38, 50, 22, 10]),
    reviews: [
      { id: 'r4', user: 'Ravi T.', stars: 10 },
      { id: 'r5', user: 'Sneha R.', stars: 9 },
      { id: 'r6', user: 'Kiran P.', stars: 8 },
    ],
  },
  {
    id: 3,
    title: 'K.G.F: Chapter 2',
    genre: 'Action',
    language: 'Kannada',
    year: 2022,
    description: 'In the blood-soaked Kolar Gold Fields, Rocky\'s undisputed reign faces perilous threats from Adheera, Ramika Sen, and internal rivals in a relentless clash for power.',
    isFavorite: false,
    showtimes: makeShowtimes(3, 190, [30, 50, 45, 8, 50]),
    reviews: [
      { id: 'r7', user: 'Deepak N.', stars: 9 },
      { id: 'r8', user: 'Asha B.', stars: 8 },
      { id: 'r9', user: 'Suresh V.', stars: 8 },
    ],
  },
  {
    id: 4,
    title: 'Baahubali 2: The Conclusion',
    genre: 'Action',
    language: 'Telugu',
    year: 2017,
    description: 'The saga of Mahishmati reaches its peak as the truth behind Amarendra Baahubali\'s tragic demise is unveiled, paving the path for Mahendra Baahubali to reclaim the throne.',
    isFavorite: true,
    showtimes: makeShowtimes(4, 170, [20, 35, 50, 5, 40]),
    reviews: [
      { id: 'r10', user: 'Meena L.', stars: 9 },
      { id: 'r11', user: 'Raj C.', stars: 8 },
      { id: 'r12', user: 'Divya H.', stars: 8 },
    ],
  },
  {
    id: 5,
    title: '777 Charlie',
    genre: 'Drama',
    language: 'Kannada',
    year: 2022,
    description: 'A solitary, dispassionate factory worker finds his life completely turned around after forming an unconditional bond with an irrepressible runaway Labrador puppy named Charlie.',
    isFavorite: false,
    showtimes: makeShowtimes(5, 160, [10, 25, 38, 50, 12]),
    reviews: [
      { id: 'r13', user: 'Nisha D.', stars: 9 },
      { id: 'r14', user: 'Gopal R.', stars: 9 },
      { id: 'r15', user: 'Lakshmi A.', stars: 9 },
    ],
  },
  {
    id: 6,
    title: 'Jathi Ratnalu',
    genre: 'Comedy',
    language: 'Telugu',
    year: 2021,
    description: 'Three innocent and goofy small-town friends travel to Hyderabad with big dreams, only to become prime suspects in a comedic, high-stakes political assassination plot.',
    isFavorite: false,
    showtimes: makeShowtimes(6, 150, [5, 18, 30, 0, 50]),
    reviews: [
      { id: 'r16', user: 'Anand G.', stars: 8 },
      { id: 'r17', user: 'Sita P.', stars: 7 },
      { id: 'r18', user: 'Rahul M.', stars: 7 },
    ],
  },
  {
    id: 7,
    title: 'Lucia',
    genre: 'Sci-Fi',
    language: 'Kannada',
    year: 2013,
    description: 'An usher plagued by chronic insomnia takes a mysterious psychoactive pill called Lucia, which entangles his waking reality with vivid, surreal dreamscapes.',
    isFavorite: false,
    showtimes: makeShowtimes(7, 140, [40, 50, 10, 30, 20]),
    reviews: [
      { id: 'r19', user: 'Chethan B.', stars: 9 },
      { id: 'r20', user: 'Pooja K.', stars: 8 },
      { id: 'r21', user: 'Sunil R.', stars: 8 },
    ],
  },
  {
    id: 8,
    title: 'Goodachari',
    genre: 'Thriller',
    language: 'Telugu',
    year: 2018,
    description: 'An ambitious recruit in secret intelligence agency Trinetra is framed for murdering his mentors and must race against time to expose a syndicate of deep-cover moles.',
    isFavorite: false,
    showtimes: makeShowtimes(8, 155, [25, 50, 42, 15, 8]),
    reviews: [
      { id: 'r22', user: 'Aditya S.', stars: 8 },
      { id: 'r23', user: 'Kavita N.', stars: 8 },
      { id: 'r24', user: 'Balu T.', stars: 7 },
    ],
  },
].map((m) => ({ ...m, rating: calcAvgRating(m.reviews) }));

// Available Filter Options
const LANGUAGES = ['All', 'Kannada', 'Telugu'];
const GENRES = ['All', 'Action', 'Comedy', 'Sci-Fi', 'Drama', 'Thriller'];
const RATING_FILTERS = [
  { label: 'All Ratings', value: 'All' },
  { label: '8+ Rating', value: '8+' },
  { label: '9+ Rating', value: '9+' },
];


function App() {
  // State management with useState
  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [bookingMovieId, setBookingMovieId] = useState(null);

  // Toggle favorite status using Array.prototype.map and the Spread Operator (...)
  const handleToggleFavorite = (movieId) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      )
    );
  };

  // Add a new user review and recalculate the average rating
  const handleAddReview = (movieId, reviewerName, stars) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        if (movie.id !== movieId) return movie;
        const newReview = {
          id: `rev-${Date.now()}-${Math.random()}`,
          user: reviewerName.trim() || 'Anonymous',
          stars: Math.min(10, Math.max(1, stars)),
        };
        const updatedReviews = [...movie.reviews, newReview];
        return {
          ...movie,
          reviews: updatedReviews,
          rating: calcAvgRating(updatedReviews),
        };
      })
    );
  };

  // Confirm booking: mark seats as booked in the matching showtime
  const handleConfirmBooking = (movieId, showtimeId, newSeats) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        if (movie.id !== movieId) return movie;
        const updatedShowtimes = movie.showtimes.map((st) =>
          st.id === showtimeId
            ? { ...st, bookedSeats: [...st.bookedSeats, ...newSeats] }
            : st
        );
        return { ...movie, showtimes: updatedShowtimes };
      })
    );
  };

  // Find booking movie
  const bookingMovie = movies.find((m) => m.id === bookingMovieId);

  // Find selected movie
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId);

  // Calculate favorite movies count
  const totalFavoritesCount = movies.filter((movie) => movie.isFavorite).length;
  const filteredMovies = movies.filter((movie) => {
    // 1. Search term filter (case-insensitive)
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    // 2. Language filter
    const matchesLanguage =
      selectedLanguage === 'All' || movie.language.toLowerCase() === selectedLanguage.toLowerCase();

    // 3. Genre filter
    const matchesGenre =
      selectedGenre === 'All' || movie.genre.toLowerCase() === selectedGenre.toLowerCase();

    // 4. Rating filter
    let matchesRating = true;
    if (selectedRating === '8+') {
      matchesRating = movie.rating >= 8.0;
    } else if (selectedRating === '9+') {
      matchesRating = movie.rating >= 9.0;
    }

    // 5. Favorites filter
    const matchesFavorite = !showFavoritesOnly || movie.isFavorite;

    return matchesSearch && matchesLanguage && matchesGenre && matchesRating && matchesFavorite;
  });

  // Check if any filter is currently applied
  const isFilterActive =
    searchTerm.trim() !== '' ||
    selectedLanguage !== 'All' ||
    selectedGenre !== 'All' ||
    selectedRating !== 'All' ||
    showFavoritesOnly;

  // Reset all filters to default state
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('All');
    setSelectedGenre('All');
    setSelectedRating('All');
    setShowFavoritesOnly(false);
  };

  return (
    <div className="app-layout">
      {/* Background Star & Aurora Elements */}
      <div className="bg-aurora-glow aura-1"></div>
      <div className="bg-aurora-glow aura-2"></div>
      <div className="bg-aurora-glow aura-3"></div>
      <div className="bg-stars-overlay"></div>

      {/* Main Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        favoritesCount={totalFavoritesCount}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
      />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-tagline">
              <span className="sparkle-icon">✨</span>
              <span>DISCOVER • SEARCH • SAVE</span>
            </div>

            <h2 className="hero-title">
              Explore movies you'll <span className="hero-highlight">want to watch.</span>
            </h2>

            <p className="hero-description">
              Explore blockbuster masterpieces and critically acclaimed cinema across Kannada and Telugu industries with real-time interactive user ratings, genre filters, and favorites.
            </p>

            <div className="hero-stats-row">
              <div className="stat-circle-card">
                <div className="stat-number-gradient">{movies.length}</div>
                <div className="stat-label">Total Movies</div>
              </div>

              <div className="stat-circle-card">
                <div className="stat-number-gradient">{totalFavoritesCount}</div>
                <div className="stat-label">Saved Favorites</div>
              </div>

              <div className="stat-circle-card">
                <div className="stat-number-gradient">4 & 4</div>
                <div className="stat-label">Kannada & Telugu</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Control Center Section */}
        <section className="filter-section">
          <div className="filter-card">
            <div className="filter-header-row">
              <div>
                <span className="filter-subheading">MOVIE EXPLORER</span>
                <h3 className="filter-heading">Find your next movie</h3>
              </div>

              <div className="filter-quick-toggles">
                <button
                  type="button"
                  className={`btn-toggle ${!showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(false)}
                >
                  Show All Movies
                </button>
                <button
                  type="button"
                  className={`btn-toggle ${showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(true)}
                >
                  Show Favorites ({totalFavoritesCount})
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="filter-controls-row">
              {/* Language / Industry Filter Buttons */}
              <div className="filter-group">
                <span className="filter-label">Cinema:</span>
                <div className="filter-buttons-list">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`filter-chip ${selectedLanguage === lang ? 'active' : ''}`}
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang === 'All' ? 'All Cinema' : `${lang} Cinema`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter Buttons */}
              <div className="filter-group">
                <span className="filter-label">Genre:</span>
                <div className="filter-buttons-list">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter Buttons */}
              <div className="filter-group">
                <span className="filter-label">Rating:</span>
                <div className="filter-buttons-list">
                  {RATING_FILTERS.map((ratingOption) => (
                    <button
                      key={ratingOption.value}
                      type="button"
                      className={`filter-chip ${selectedRating === ratingOption.value ? 'active' : ''}`}
                      onClick={() => setSelectedRating(ratingOption.value)}
                    >
                      {ratingOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Meta Bar (Status & Clear Button) */}
            <div className="filter-meta-bar">
              <div className="display-count">
                Showing <strong className="count-accent">{filteredMovies.length}</strong> of{' '}
                {movies.length} movies
                {selectedLanguage !== 'All' && ` (${selectedLanguage} Cinema)`}
                {showFavoritesOnly && ' (Favorites only)'}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>

              {/* Conditional Rendering: Clear Filters Button */}
              {isFilterActive && (
                <button
                  type="button"
                  className="btn-clear-filters"
                  onClick={handleClearFilters}
                >
                  <span className="clear-icon">✕</span> Clear Filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Movie Cards Grid Section */}
        <section className="catalog-section">
          <MovieList
            movies={filteredMovies}
            onSelectMovie={(id) => setSelectedMovieId(id)}
            onToggleFavorite={handleToggleFavorite}
            onAddReview={handleAddReview}
            onBookTickets={(id) => setBookingMovieId(id)}
            onResetFilters={handleClearFilters}
          />
        </section>
      </main>

      {/* Conditional Rendering: Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovieId(null)}
          onToggleFavorite={handleToggleFavorite}
          onAddReview={handleAddReview}
          onBookTickets={(id) => { setSelectedMovieId(null); setBookingMovieId(id); }}
        />
      )}

      {/* Ticket Booking Modal */}
      {bookingMovie && (
        <BookingModal
          movie={bookingMovie}
          onClose={() => setBookingMovieId(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}


    </div>
  );
}

export default App;
