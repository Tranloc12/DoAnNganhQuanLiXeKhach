import React from 'react';
import Seat from './Seat';

const Deck = ({ title, seats, onSeatClick, isMatrix }) => (
  <div>
    <h4 className="font-bold text-lg mb-2 text-center">{title}</h4>
    <div>
      {isMatrix
        ? seats.map((row, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 12,
                minHeight: 48,
              }}
            >
              {row.map(seat => (
                <Seat
                  key={seat.seatNumber}
                  seatNumber={seat.seatNumber}
                  status={seat.status}
                  onClick={onSeatClick}
                />
              ))}
            </div>
          ))
        : seats.map(seat => (
            <Seat
              key={seat.seatNumber}
              seatNumber={seat.seatNumber}
              status={seat.status}
              onClick={onSeatClick}
            />
          ))}
    </div>
  </div>
);

export default Deck; 