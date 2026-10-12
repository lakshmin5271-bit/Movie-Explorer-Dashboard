import React, { useState } from 'react';

/**
 * MovieDetails Component (Modal)
 * - Community reviews panel
 * - Showtime availability overview
 * - Book Tickets / Housefull button
 */
function MovieDetails({ movie, onClose, onToggleFavorite, onAddReview, onBookTickets }) {
  if (!movie) return null;

  const { id, title, genre, language, year, rating, description, isFavorite, reviews, showtimes } = movie;

  const [reviewerName, setReviewerName] = useState('');
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const movieInitial = title ? title.charAt(0) : 'M';

  // Availability
  const totalAvailableSeats = showtimes
    ? showtimes.reduce((acc, st) => acc + Math.max(0, st.totalSeats - st.bookedSeats.length), 0)
    : 0;
  const isHousefull = totalAvailableSeats === 0;

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!selectedStar) return;
    onAddReview(id, reviewerName, selectedStar);
    setSubmitted(true);
    setReviewerName('');
    setSelectedStar(0);
    setHoverStar(0);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const ratingBarWidth = (stars) => `${(stars / 10) * 100}%`;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-movie-title"
    >
      <div className="modal-container">
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close details">✕</button>

        <div className="modal-body">
          {/* Large Cinematic Poster */}
          <div className={`modal-poster-area ${getGenreColorClass(genre)}`}>
            <div className="modal-poster-mesh"></div>
            <div className="modal-monogram-circle">
              <span className="modal-initial">{movieInitial}</span>
            </div>
            <div className="modal-floating-title">{title}</div>
            <div className="modal-poster-bottom-badge">
              <span className="rating-star">★</span> {rating.toFixed(1)} / 10
              <span className="modal-review-count-badge"> · {reviews.length} reviews</span>
            </div>
            {/* Housefull overlay on poster */}
            {isHousefull && (
              <div className="modal-housefull-overlay">🚫 HOUSEFULL</div>
            )}
          </div>

          {/* Info Area */}
          <div className="modal-info-area">
            <div className="modal-header-tags">
              <span className={`genre-badge ${getGenreColorClass(genre)}`}>{genre}</span>
              {language && (
                <span className={`lang-badge ${language.toLowerCase()}`}>{language} Cinema</span>
              )}
              <span className="year-badge">{year}</span>
              <span className={`favorite-status-pill ${isFavorite ? 'fav-yes' : 'fav-no'}`}>
                {isFavorite ? '★ Favorited' : '☆ Not in Favorites'}
              </span>
            </div>

            <h2 id="modal-movie-title" className="modal-title">{title}</h2>

            {/* ── Showtime Availability Panel ── */}
            {showtimes && (
              <div className="modal-showtimes-panel">
                <div className="modal-showtimes-header">
                  <span className="modal-showtimes-label">🎬 Showtimes &amp; Availability</span>
                  {isHousefull
                    ? <span className="modal-housefull-pill">🚫 All Shows Housefull</span>
                    : <span className="modal-seats-pill">🎟 {totalAvailableSeats} seats available</span>
                  }
                </div>
                <div className="modal-showtimes-list">
                  {showtimes.map((st) => {
                    const avail = st.totalSeats - st.bookedSeats.length;
                    const full = avail <= 0;
                    const pct = (st.bookedSeats.length / st.totalSeats) * 100;
                    return (
                      <div key={st.id} className={`modal-showtime-row ${full ? 'st-full' : 'st-avail'}`}>
                        <div className="modal-showtime-info">
                          <span className="modal-st-datetime">{st.date} · {st.time}</span>
                          <span className="modal-st-price">₹{st.price}/seat</span>
                        </div>
                        <div className="modal-st-bar-wrap">
                          <div className="modal-st-bar-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className={`modal-st-avail-label ${full ? 'full' : ''}`}>
                          {full ? 'HOUSEFULL' : `${avail} left`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Community Rating Panel ── */}
            <div className="modal-community-rating-panel">
              <div className="modal-community-header">
                <div>
                  <span className="modal-community-label">Community Rating</span>
                  <div className="modal-community-score">
                    <span className="modal-community-avg">★ {rating.toFixed(1)}</span>
                    <span className="modal-community-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="modal-rating-visual-bar-wrap">
                  <div className="modal-rating-visual-bar" style={{ width: ratingBarWidth(rating) }}></div>
                </div>
              </div>

              {reviews.length > 0 && (
                <div className="modal-reviews-list">
                  <h4 className="modal-reviews-heading">All Reviews</h4>
                  <div className="modal-reviews-scroll">
                    {[...reviews].reverse().map((r) => (
                      <div key={r.id} className="modal-review-item">
                        <div className="modal-review-avatar">{r.user.charAt(0).toUpperCase()}</div>
                        <div className="modal-review-body">
                          <span className="modal-review-user">{r.user}</span>
                          <div className="modal-review-stars">
                            {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                              <span key={s} className={s <= r.stars ? 'star-filled' : 'star-empty'}>★</span>
                            ))}
                            <span className="modal-review-score">{r.stars}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form className="modal-review-form" onSubmit={handleSubmitReview}>
                <h4 className="modal-review-form-heading">Leave Your Review</h4>
                <input
                  type="text"
                  className="modal-review-name-input"
                  placeholder="Your name (optional)"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  maxLength={30}
                />
                <div
                  className="modal-review-star-picker"
                  onMouseLeave={() => setHoverStar(0)}
                  role="group"
                  aria-label="Pick star rating"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((s) => {
                    const active = hoverStar > 0 ? s <= hoverStar : s <= selectedStar;
                    return (
                      <button
                        key={s}
                        type="button"
                        className={`modal-review-star-btn ${active ? 'active' : ''}`}
                        onMouseEnter={() => setHoverStar(s)}
                        onClick={() => setSelectedStar(s)}
                        title={`Rate ${s} / 10`}
                        aria-label={`Rate ${s} out of 10`}
                      >★</button>
                    );
                  })}
                  {(hoverStar || selectedStar) > 0 && (
                    <span className="modal-review-star-hint">{hoverStar || selectedStar}/10</span>
                  )}
                </div>
                <button
                  type="submit"
                  className={`btn-modal-submit-review ${submitted ? 'submitted' : ''}`}
                  disabled={!selectedStar}
                >
                  {submitted ? '✓ Review Submitted!' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Full Description */}
            <div className="modal-section">
              <h4 className="modal-section-heading">Overview</h4>
              <p className="modal-description">{description}</p>
            </div>

            {/* Movie Specs */}
            <div className="modal-specs-grid">
              <div className="spec-card">
                <span className="spec-label">Cinema</span>
                <span className="spec-value">{language} Cinema</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Release Year</span>
                <span className="spec-value">{year}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Genre</span>
                <span className="spec-value">{genre}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Avg. Rating</span>
                <span className="spec-value">★ {rating.toFixed(1)} / 10</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions-row">
              {/* Book Tickets CTA */}
              <button
                type="button"
                className={`modal-btn-book ${isHousefull ? 'housefull' : ''}`}
                onClick={() => onBookTickets(id)}
                disabled={isHousefull}
                title={isHousefull ? 'All shows are housefull' : 'Book tickets for this movie'}
              >
                {isHousefull ? '🚫 All Shows Housefull' : '🎟 Book Tickets'}
              </button>

              <button
                type="button"
                className={`modal-btn-favorite ${isFavorite ? 'is-fav' : ''}`}
                onClick={() => onToggleFavorite(id)}
              >
                <span>{isFavorite ? '★ Remove from Favorites' : '+ Add to Favorites'}</span>
              </button>

              <button type="button" className="modal-btn-close" onClick={onClose}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
