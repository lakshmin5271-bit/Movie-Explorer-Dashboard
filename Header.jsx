import React from 'react';

/**
 * Header Component
 * Demonstrates: Functional component, props, destructuring, event handling, JSX expressions, conditional rendering.
 */
function Header({
  searchTerm,
  setSearchTerm,
  favoritesCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
}) {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Brand Logo & Subtitle */}
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <div className="brand-glow"></div>
          </div>

          <div className="brand-text">
            <h1 className="brand-title">
              Movie<span className="brand-gradient">Explorer</span>
            </h1>
            <p className="brand-subtitle">Personal movie dashboard</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="header-search-box">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              id="movie-search-input"
              className="search-input"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search movies by title"
            />
            {/* Conditional Rendering: Clear Button when user types */}
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                title="Clear search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Favorites Counter & Quick Toggle Button */}
        <div className="header-actions">
          <button
            type="button"
            className={`favorites-badge-btn ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title={showFavoritesOnly ? 'Show all movies' : 'Filter by favorites'}
          >
            <span className="fav-star-icon">★</span>
            <span className="fav-badge-label">Favorites</span>
            <span className="fav-counter-pill">{favoritesCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
