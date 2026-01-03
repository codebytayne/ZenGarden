
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SunIcon } from './Icons';
import { Language } from '../types';
import { translations } from '../translations';

interface TimerProps {
  initialMinutes: number;
  onComplete: (minutes: number) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  currentPlant: any;
  lang: Language;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, onComplete, isActive, setIsActive, currentPlant, lang }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [initialSeconds] = useState(initialMinutes * 60);
  const timerRef = useRef<number | null>(null);
  const t = translations[lang];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tick = useCallback(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current);
        setIsActive(false);
        onComplete(initialMinutes);
        return 0;
      }
      return prev - 1;
    });
  }, [initialMinutes, onComplete, setIsActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(tick, 1000);
    } else {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isActive, tick]);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialMinutes * 60);
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 px-4">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer Progress Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="135"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-green-100"
          />
          <circle
            cx="144"
            cy="144"
            r="135"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={848}
            strokeDashoffset={848 - (848 * progress) / 100}
            strokeLinecap="round"
            className="text-green-500 transition-all duration-1000 ease-linear shadow-inner"
          />
        </svg>

        {/* Timer Text */}
        <div className="flex flex-col items-center z-10">
          <div className="text-6xl font-bold text-green-900 tracking-tighter tabular-nums">
            {formatTime(seconds)}
          </div>
          <div className="text-green-600 font-medium mt-2 flex items-center">
            <SunIcon className="w-4 h-4 mr-1 animate-spin-slow" />
            {t.generatingFocus}
          </div>
        </div>
        
        {/* Plant Preview Box: Centered and flexible to accommodate full text */}
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2.5 rounded-2xl border border-green-200 shadow-xl shadow-green-900/5 flex items-center space-x-3 z-20 min-w-max max-w-[90vw]"
        >
           <img 
            src={currentPlant.imageUrl} 
            alt="Focus plant" 
            className="w-10 h-10 rounded-xl object-cover shadow-sm flex-shrink-0" 
          />
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter leading-none mb-0.5">Growing Now</span>
              <span className="text-sm font-bold text-green-900 leading-tight whitespace-nowrap">
                {currentPlant.name}
              </span>
           </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-12 py-4 rounded-3xl font-bold text-white shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center min-w-[180px] ${
            isActive ? 'bg-orange-400 hover:bg-orange-500' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isActive ? t.pauseJourney : t.beginFocus}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-3xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95"
          title={t.reset}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Timer;
