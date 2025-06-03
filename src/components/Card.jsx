import React from 'react';
import './Card.css';

const Card = ({ isFlipped, onClick, children }) => {
  return (
    <div className={`card${isFlipped ? ' flipped' : ''}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">
          {children}
        </div>
        <div className="card-back" />
      </div>
    </div>
  );
};

export default Card; 