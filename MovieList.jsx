import React from 'react';
import MovieCard from './MovieCard.jsx';

/**
 * MovieList Component
 * Demonstrates: Component composition, props, map() over array of objects,
 * conditional rendering (empty state), keys in lists.
 */
function MovieList({ movies, onSelectMovie, onToggleFavorite, onAddReview, onBookTickets, onResetFilters }) {
  // Conditional rendering: when no movies match search or filters
  if (movies.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 className="empty-state-title">No movies found</h3>
          <p className="empty-state-desc">
            We couldn't find any movies matching your current search criteria or active filters. Try adjusting your search term, genre, or rating filter.
          </p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={onResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {/* Array.map() iterating through movie objects with unique key prop */}
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onSelectMovie={onSelectMovie}
          onToggleFavorite={onToggleFavorite}
          onAddReview={onAddReview}
          onBookTickets={onBookTickets}
        />
      ))}
    </div>
  );
}

export default MovieList;
