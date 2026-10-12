import React, { useState } from 'react';

/**
 * BookingModal Component
 * - Select a showtime
 * - Interactive seat grid (green = available, red = booked, blue = selected)
 * - Shows HOUSEFULL if no seats remain
 * - Booking confirmation with ticket summary
 */
function BookingModal({ movie, onClose, onConfirmBooking }) {
  if (!movie) return null;

  const { id, title, genre, language, year, showtimes } = movie;

  const [selectedShowtime, setSelectedShowtime] = useState(showtimes[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState('select'); // 'select' | 'confirm' | 'done'
  const [userName, setUserName] = useState('');

  // Derive showtime details
  const totalSeats = selectedShowtime.totalSeats;
  const bookedSeats = selectedShowtime.bookedSeats; // array of seat numbers (1-indexed)
  const availableCount = totalSeats - bookedSeats.length - selectedSeats.length;
  const isFull = bookedSeats.length >= totalSeats;

  const COLS = 10; // 10 seats per row
  const ROWS = Math.ceil(totalSeats / COLS);
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const getSeatStatus = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return 'booked';
    if (selectedSeats.includes(seatNum)) return 'selected';
    return 'available';
  };

  const toggleSeat = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return; // can't select booked seat
    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : prev.length < 8 // max 8 seats per booking
        ? [...prev, seatNum]
        : prev
    );
  };

  const handleShowtimeChange = (st) => {
    setSelectedShowtime(st);
    setSelectedSeats([]);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedSeats.length || !selectedShowtime) return;
    onConfirmBooking(id, selectedShowtime.id, selectedSeats);
    setStep('done');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Seat label helper: A1, A2 … B1 …
  const seatLabel = (seatNum) => {
    const row = Math.floor((seatNum - 1) / COLS);
    const col = ((seatNum - 1) % COLS) + 1;
    return `${rowLabels[row]}${col}`;
  };

  return (
    <div className="booking-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <div className="booking-modal">

        {/* Header */}
        <div className="booking-header">
          <div>
            <p className="booking-subtitle">🎟️ BOOK TICKETS</p>
            <h2 id="booking-title" className="booking-title">{title}</h2>
            <p className="booking-meta">{language} · {genre} · {year}</p>
          </div>
          <button type="button" className="booking-close-btn" onClick={onClose} aria-label="Close booking">✕</button>
        </div>

        {step === 'done' ? (
          /* ── Confirmation Screen ── */
          <div className="booking-done-screen">
            <div className="booking-done-icon">🎉</div>
            <h3 className="booking-done-title">Booking Confirmed!</h3>
            <p className="booking-done-movie">{title}</p>
            <div className="booking-done-details">
              <div className="booking-done-row">
                <span>Date &amp; Time</span>
                <strong>{selectedShowtime.date} · {selectedShowtime.time}</strong>
              </div>
              <div className="booking-done-row">
                <span>Seats</span>
                <strong>{selectedSeats.map(seatLabel).join(', ')}</strong>
              </div>
              <div className="booking-done-row">
                <span>Booked by</span>
                <strong>{userName || 'Guest'}</strong>
              </div>
              <div className="booking-done-row">
                <span>Total</span>
                <strong className="booking-done-price">₹{selectedSeats.length * selectedShowtime.price}</strong>
              </div>
            </div>
            <button type="button" className="btn-booking-primary" onClick={onClose}>
              Done 🎬
            </button>
          </div>
        ) : (
          <div className="booking-body">
            {/* ── Step 1: Showtime Picker ── */}
            <div className="booking-section">
              <h4 className="booking-section-label">Select Showtime</h4>
              <div className="showtime-grid">
                {showtimes.map((st) => {
                  const stFull = st.bookedSeats.length >= st.totalSeats;
                  const isActive = selectedShowtime.id === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      className={`showtime-pill ${isActive ? 'active' : ''} ${stFull ? 'full' : ''}`}
                      onClick={() => !stFull && handleShowtimeChange(st)}
                      disabled={stFull}
                      title={stFull ? 'Housefull' : `${st.totalSeats - st.bookedSeats.length} seats left`}
                    >
                      <span className="showtime-date">{st.date}</span>
                      <span className="showtime-time">{st.time}</span>
                      {stFull
                        ? <span className="showtime-status full">HOUSEFULL</span>
                        : <span className="showtime-status avail">{st.totalSeats - st.bookedSeats.length} left</span>
                      }
                      <span className="showtime-price">₹{st.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Step 2: Seat Map ── */}
            <div className="booking-section">
              <div className="seat-map-header">
                <h4 className="booking-section-label">Pick Seats (max 8)</h4>
                <div className="seat-legend">
                  <span className="legend-dot available"></span>Available
                  <span className="legend-dot booked"></span>Booked
                  <span className="legend-dot selected"></span>Selected
                </div>
              </div>

              {isFull ? (
                <div className="housefull-banner">
                  <span className="housefull-text">🚫 HOUSEFULL</span>
                  <p>No seats available for this show.</p>
                </div>
              ) : (
                <>
                  {/* Screen indicator */}
                  <div className="screen-indicator">
                    <div className="screen-line"></div>
                    <span className="screen-label">SCREEN</span>
                  </div>

                  {/* Seat Grid */}
                  <div className="seat-grid">
                    {Array.from({ length: ROWS }, (_, rowIdx) => (
                      <div key={rowIdx} className="seat-row">
                        <span className="seat-row-label">{rowLabels[rowIdx]}</span>
                        {Array.from({ length: COLS }, (_, colIdx) => {
                          const seatNum = rowIdx * COLS + colIdx + 1;
                          if (seatNum > totalSeats) return <span key={colIdx} className="seat-spacer" />;
                          const status = getSeatStatus(seatNum);
                          return (
                            <button
                              key={colIdx}
                              type="button"
                              className={`seat-btn seat-${status}`}
                              onClick={() => toggleSeat(seatNum)}
                              disabled={status === 'booked'}
                              title={`Seat ${seatLabel(seatNum)} — ${status}`}
                              aria-label={`Seat ${seatLabel(seatNum)}, ${status}`}
                            >
                              {seatLabel(seatNum)}
                            </button>
                          );
                        })}
                        <span className="seat-row-label">{rowLabels[rowIdx]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Selected seats summary */}
                  {selectedSeats.length > 0 && (
                    <div className="selected-seats-bar">
                      <span className="selected-seats-list">
                        Selected: <strong>{selectedSeats.map(seatLabel).join(', ')}</strong>
                      </span>
                      <span className="selected-seats-total">
                        Total: <strong className="price-highlight">₹{selectedSeats.length * selectedShowtime.price}</strong>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Step 3: Confirm Form ── */}
            {!isFull && (
              <form className="booking-form" onSubmit={handleConfirm}>
                <h4 className="booking-section-label">Your Details</h4>
                <input
                  type="text"
                  className="booking-name-input"
                  placeholder="Your name (optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={40}
                />
                <div className="booking-form-footer">
                  <div className="booking-summary-chips">
                    <span className="booking-chip">{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected</span>
                    <span className="booking-chip avail-chip">{availableCount} left</span>
                  </div>
                  <button
                    type="submit"
                    className="btn-booking-primary"
                    disabled={selectedSeats.length === 0}
                  >
                    Confirm Booking →
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
