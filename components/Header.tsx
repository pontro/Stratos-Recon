import React, { useState, useEffect } from 'react';
import { AppPhase } from '../types';
import { WifiOff, Settings } from 'lucide-react';
import { detectPlatform } from '../utils/platformDetector';

interface HeaderProps {
  currentPhase: AppPhase;
  isScoutTab: boolean;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPhase, isScoutTab, onSettingsClick }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const phases = [AppPhase.SETUP, AppPhase.AUTO, AppPhase.TELEOP, AppPhase.ADVANCED, AppPhase.REVIEW];
  const currentIndex = phases.indexOf(currentPhase);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="pt-6 px-6 pb-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-tech text-2xl font-black tracking-tighter leading-none">
            STRATOS<span className="text-white/30">SCOUT</span>
          </h1>
          {isOffline && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[8px] font-tech text-orange-500 uppercase tracking-widest animate-pulse">
              <WifiOff size={10} /> Offline
            </div>
          )}
          {(detectPlatform() === 'pc' || detectPlatform() === 'android') && (
            <button
              onClick={onSettingsClick}
              className="p-2 text-white/20 hover:text-white transition-colors active:scale-90"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
      </div>

      {isScoutTab && currentPhase !== AppPhase.FINISH && (
        <div className="flex gap-2 h-1 w-full">
          {phases.map((p, i) => (
            <div
              key={p}
              className={`flex-1 rounded-full transition-all duration-500 ${currentIndex >= i
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