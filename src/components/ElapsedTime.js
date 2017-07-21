import React from 'react';
import moment from 'moment';

const ElapsedTime = ({ elapsedTime }) => {
  const generateElapsedTimeString = () => {
    if(elapsedTime === null) {
      return '';
    }

    return `about ${
        moment(new Date(0))
          .from(new Date(elapsedTime), true)
      }`;
  }

  return (
    <div className="elapsed-time">
      {generateElapsedTimeString()}
    </div>
  );
}

export default ElapsedTime;
