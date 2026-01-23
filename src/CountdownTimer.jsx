import { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <div className="bg-deep-navy text-white px-3 py-2 rounded-lg font-bold text-lg md:text-2xl min-w-[50px] md:min-w-[70px] text-center">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <span className="text-xs md:text-sm text-gray-600 mt-1">일</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="bg-deep-navy text-white px-3 py-2 rounded-lg font-bold text-lg md:text-2xl min-w-[50px] md:min-w-[70px] text-center">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <span className="text-xs md:text-sm text-gray-600 mt-1">시</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-deep-navy text-white px-3 py-2 rounded-lg font-bold text-lg md:text-2xl min-w-[50px] md:min-w-[70px] text-center">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span className="text-xs md:text-sm text-gray-600 mt-1">분</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-vibrant-orange text-white px-3 py-2 rounded-lg font-bold text-lg md:text-2xl min-w-[50px] md:min-w-[70px] text-center">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <span className="text-xs md:text-sm text-gray-600 mt-1">초</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
