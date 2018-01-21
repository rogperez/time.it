import React from 'react';
import moment from 'moment';

const convertToString = (unit) => {
	if(unit === 0) return '00';
	if(unit > 9) {
		return unit.toString();
	} else return `0${unit.toString()}`;
}

const ElapsedTime = ({ elapsedTime, showPreciseTime }) => {
  const getElapsedTimeDisplay = () => {
    if(showPreciseTime) {
      return generatePrecisionString();
    } else {
      return generateFriendlyString();
    }
  }

  const generatePrecisionString = () => {
		let hours = 0;
		let minutes = 0;

    let elapsedSeconds = elapsedTime/1000;
		if(elapsedSeconds >= 3600) {
			hours = Math.floor(elapsedSeconds / 3600);
			elapsedSeconds -= (hours*3600);
		}

		if(elapsedSeconds > 60) {
			minutes = Math.floor(elapsedSeconds / 60)
			elapsedSeconds -= (minutes*60);
		}
		const seconds = Math.floor(elapsedSeconds);

		return [
			convertToString(hours),
			convertToString(minutes),
			convertToString(seconds)
		].join(':');
  }

  const generateFriendlyString = () => {
    if(elapsedTime === 0) {
      return '';
    }

    return `${
        moment(new Date(0))
          .from(new Date(elapsedTime), true)
      }`;
  }

  return (
    <div className="elapsed-time">
      {getElapsedTimeDisplay()}
    </div>
  );
}

export default ElapsedTime;
