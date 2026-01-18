import React from 'react';
import { AppPhase } from '../types';

interface HeaderProps {
  currentPhase: AppPhase;
  isScoutTab: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentPhase, isScoutTab }) => {
  const phases = [AppPhase.SETUP, AppPhase.AUTO, AppPhase.TELEOP, AppPhase.ADVANCED, AppPhase.REVIEW];
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <header className="pt-6 px-6 pb-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-tech text-2xl tracking-tighter leading-none">
          STRATOS<span className="text-white/30">SCOUT</span>
        </h1>
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
      </div>
      
      {isScoutTab && currentPhase !== AppPhase.FINISH && (
        <div className="flex gap-2 h-1 w-full">
          {phases.map((p, i) => (
            <div 
              key={p}
              className={`flex-1 rounded-full transition-all duration-500 ${
                currentIndex >= i 
                  ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;