import React, { useState } from 'react';

/**
 * MovieCard Component
 * - Community-driven star ratings
 * - Housefull badge when all showtimes are sold out
 * - "Book Tickets" button that opens the booking modal
 */
function MovieCard({ movie, onSelectMovie, onToggleFavorite, onAddReview, onBookTickets }) {
  const { id, title, genre, language, year, rating, description, isFavorite, reviews, showtimes } = movie;

  const [reviewerName, setReviewerName] = useState('');
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const movieInitial = title ? title.charAt(0) : 'M';

  // Compute seat availability across all showtimes
  const totalAvailableSeats = showtimes
    ? showtimes.reduce((acc, st) => acc + Math.max(0, st.totalSeats - st.bookedSeats.length), 0)
    : 0;
  const isHousefull = totalAvailableSeats === 0;

  // Next available showtime (for quick info on card)
  const nextAvailable = showtimes
    ? showtimes.find((st) => st.bookedSeats.length < st.totalSeats)
    : null;

  const getGenreColorClass = (movieGenre) => {
    switch (movieGenre.toLowerCase()) {
      case 'sci-fi':   return 'genre-scifi';
      case 'action':   return 'genre-action';
      case 'comedy':   return 'genre-comedy';
      case 'drama':    return 'genre-drama';
      case 'thriller': return 'genre-thriller';
      default:         return 'genre-default';
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedStar) return;
    onAddReview(id, reviewerName, selectedStar);
    setSubmitted(true);
    setReviewerName('');
    setSelectedStar(0);
    setHoverStar(0);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <article className="movie-card" data-genre={genre}>
      {/* Cinematic Poster Area */}
      <div className={`card-poster ${getGenreColorClass(genre)}`}>
        <div className="poster-mesh"></div>
        <div className="poster-monogram-container">
          <span className="poster-initial">{movieInitial}</span>
          <span className="poster-backdrop-title">{title}</span>
        </div>

        {/* Top Floating Badges */}
        <div className="poster-top-bar">
          <span className={`genre-badge ${getGenreColorClass(genre)}`}>{genre}</span>
          {language && (
            <span className={`lang-badge ${language.toLowerCase()}`}>{language}</span>
          )}
          <span className="year-badge">{year}</span>
        </div>

        {/* Housefull / Seats Badge */}
        {isHousefull ? (
          <div className="housefull-badge-poster">🚫 HOUSEFULL</div>
        ) : (
          nextAvailable && (
            <div className="seats-badge-poster">
              🎟 {totalAvailableSeats} seats left
            </div>
          )
        )}

        {/* Favorite Icon Button */}
        <button
          type="button"
          className={`favorite-toggle-btn ${isFavorite ? 'is-fav' : ''}`}
          onClick={() => onToggleFavorite(id)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          <span className="fav-star">{isFavorite ? '★' : '☆'}</span>
        </button>

        {/* Community Rating Tag */}
        <div className="card-rating-tag">
          <span className="rating-star">★</span>
          <span className="rating-number">{rating.toFixed(1)}</span>
          <span className="rating-count-tiny">({reviews.length})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title" title={title}>{title}</h3>
        <p className="card-description">{description}</p>

        {/* Community Rating Section */}
        <div className="community-rating-section">
          <div className="community-rating-header">
            <span className="community-rating-label">Community Rating</span>
            <div className="community-avg-display">
              <span className="community-avg-value">★ {rating.toFixed(1)}</span>
              <span className="community-avg-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="review-mini-list">
              {reviews.slice(-2).map((r) => (
                <div key={r.id} className="review-mini-item">
                  <span className="review-mini-user">{r.user}</span>
                  <span className="review-mini-stars">{'★'.repeat(r.stars)}{'☆'.repeat(10 - r.stars)}</span>
                  <span className="review-mini-score">{r.stars}/10</span>
                </div>
              ))}
            </div>
          )}

          {/* Review submission form */}
          <form className="review-form" onSubmit={handleSubmitReview} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className="review-name-input"
              placeholder="Your name (optional)"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              maxLength={30}
              aria-label="Your name"
            />
            <div
              className="review-star-picker"
              onMouseLeave={() => setHoverStar(0)}
              role="group"
              aria-label={`Pick your star rating for ${title}`}
            >
              {[1,2,3,4,5,6,7,8,9,10].map((s) => {
                const active = hoverStar > 0 ? s <= hoverStar : s <= selectedStar;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`review-star-btn ${active ? 'active' : ''}`}
                    onMouseEnter={() => setHoverStar(s)}
                    onClick={() => setSelectedStar(s)}
                    title={`Rate ${s} / 10`}
                    aria-label={`Rate ${s} out of 10`}
                  >★</button>
                );
              })}
              {(hoverStar || selectedStar) > 0 && (
                <span className="review-star-hint">{hoverStar || selectedStar}/10</span>
              )}
            </div>
            <button
              type="submit"
              className={`btn-submit-review ${submitted ? 'submitted' : ''}`}
              disabled={!selectedStar}
            >
              {submitted ? '✓ Thanks!' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Card Action Buttons */}
        <div className="card-actions">
          <button type="button" className="btn-view-details" onClick={() => onSelectMovie(id)}>
            <span>View Details</span>
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          {/* Book Tickets Button */}
          <button
            type="button"
            className={`btn-book-tickets ${isHousefull ? 'housefull' : ''}`}
            onClick={() => onBookTickets(id)}
            title={isHousefull ? 'All shows housefull' : 'Book tickets'}
          >
            {isHousefull ? '🚫 Housefull' : '🎟 Book Tickets'}
          </button>

          <button
            type="button"
            className={`btn-fav-action ${isFavorite ? 'active-remove' : 'active-add'}`}
            onClick={() => onToggleFavorite(id)}
          >
            {isFavorite ? 'Remove Favorite' : '+ Favorite'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
