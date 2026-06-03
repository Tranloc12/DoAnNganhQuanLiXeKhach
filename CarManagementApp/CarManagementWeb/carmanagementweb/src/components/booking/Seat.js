import React from 'react';
import soldIcon from '../images/icons/svg.png';
import availableIcon from '../images/icons/svg2.png';
import selectedIcon from '../images/icons/svg3.png';
import './Seat.css'; // Assuming you have a CSS file for styles

const getSeatIcon = (status) => {
  switch (status) {
    case 'available': return availableIcon;
    case 'selected': return selectedIcon;
    case 'sold': return soldIcon;
    default: return availableIcon;
  }
};

const getSeatNumberColor = (status) => {
  switch (status) {
    case 'available': return '#339AF4';
    case 'selected': return '#EF5222';
    case 'sold': return '#A2ABB3';
    default: return '#A2ABB3';
  }
};

const Seat = ({ seatNumber, status, onClick }) => {
  const seatIcon = getSeatIcon(status);
  const numberColor = getSeatNumberColor(status);
  const isSold = status === 'sold';

  return (
    <div
      style={{
        position: 'relative',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(52,144,220,0.08)',
        margin: 2,
        cursor: isSold ? 'not-allowed' : 'pointer',
        opacity: isSold ? 0.7 : 1,
        transition: 'transform 0.1s, box-shadow 0.1s',
        background: '#fff',
      }}
      onClick={() => !isSold && onClick(seatNumber)}
      onMouseOver={e => {
        if (!isSold) {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(52,144,220,0.18)';
        }
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(52,144,220,0.08)';
      }}
    >
      <img src={seatIcon} alt={`seat icon ${seatNumber}`} width="44" height="44" />
      <span
        style={{
          position: 'absolute',
          top: 7,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: numberColor,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {seatNumber}
      </span>
    </div>
  );
};

export default Seat;