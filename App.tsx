import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SetupPhase from './components/SetupPhase';
import AutoPhase from './components/AutoPhase';
import TeleopPhase from './components/TeleopPhase';
import AdvancedPhase from './components/AdvancedPhase';
import ReviewPhase from './components/ReviewPhase';
import VaultTab from './components/VaultTab';
import { ScoutingData, AppPhase, Tab, MatchType, StartingZone, Alliance } from './types';

const getInitialData = (): ScoutingData => ({
  id: '',
  teamNumber: '',
  matchNumber: '',
  matchType: MatchType.QUALIFICATION,
  startingZone: StartingZone.DEPOT,
  alliance: Alliance.RED,
  scouter: '',
  isActiveInAuto: true,
  autoHang: false,
  autoFuelPoints: 0,
  autoComments: '',
  teleopFuelPoints: 0,
  climbLevel: 0,
  teleopComments: '',
  adv_field_role: -1,
  adv_hopper_cap: -1,
  adv_chasis: -1,
  adv_intake: -1,
  adv_shooter: [],
  adv_trench: -1,
  adv_broke: -1,
  adv_fixed: -1,
  adv_climber: -1,
  endgameScore: 0,
  comments: ''
});

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.SCOUT);
  const [currentPhase, setCurrentPhase] = useState<AppPhase>(AppPhase.SETUP);
  const [data, setData] = useState<ScoutingData>(getInitialData());
  const [showSettings, setShowSettings] = useState(false);

  // LAZY INITIALIZATION: Load from localStorage immediately during first render
  const [vault, setVault] = useState<ScoutingData[]>(() => {
    try {
      const saved = localStorage.getItem('stratos_vault');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Vault recovery failed", e);
      return [];
    }
  });

  // Centralized Persistence Sync
  useEffect(() => {
    localStorage.setItem('stratos_vault', JSON.stringify(vault));
  }, [vault]);

  const saveToVault = useCallback(() => {
    // Generate a unique ID for this specific record
    const newData = { ...data, id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };

    setVault((prevVault) => [newData, ...prevVault]);

    // UI Resets
    setCurrentTab(Tab.VAULT);
    setData(getInitialData());
    setCurrentPhase(AppPhase.SETUP);
  }, [data]);

  const handleNextPhase = () => {
    switch (currentPhase) {
      case AppPhase.SETUP: setCurrentPhase(AppPhase.AUTO); break;
      case AppPhase.AUTO: setCurrentPhase(AppPhase.TELEOP); break;
      case AppPhase.TELEOP: setCurrentPhase(AppPhase.ADVANCED); break;
      case AppPhase.ADVANCED: setCurrentPhase(AppPhase.REVIEW); break;
      case AppPhase.REVIEW: saveToVault(); break;
    }
  };

  const handleBackPhase = () => {
    switch (currentPhase) {
      case AppPhase.AUTO: setCurrentPhase(AppPhase.SETUP); break;
      case AppPhase.TELEOP: setCurrentPhase(AppPhase.AUTO); break;
      case AppPhase.ADVANCED: setCurrentPhase(AppPhase.TELEOP); break;
      case AppPhase.REVIEW: setCurrentPhase(AppPhase.ADVANCED); break;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md md:max-w-2xl lg:max-w-6xl mx-auto bg-[#0c0c0c] text-white shadow-2xl relative overflow-hidden selection:bg-white/20">
      <Header
        currentPhase={currentPhase}
        isScoutTab={currentTab === Tab.SCOUT}
        onSettingsClick={() => {
          setShowSettings(true);
          setCurrentTab(Tab.VAULT);
        }}
      />

      <main className="flex-1 flex flex-col overflow-y-auto px-6 md:px-8 lg:px-12 pt-2 pb-24 custom-scrollbar">
        {currentTab === Tab.SCOUT && (
          <div className="flex-1 flex flex-col">
            {currentPhase === AppPhase.SETUP && <SetupPhase data={data} setData={setData} onNext={handleNextPhase} />}
            {currentPhase === AppPhase.AUTO && <AutoPhase data={data} setData={setData} onNext={handleNextPhase} onBack={handleBackPhase} />}
            {currentPhase === AppPhase.TELEOP && <TeleopPhase data={data} setData={setData} onNext={handleNextPhase} onBack={handleBackPhase} />}
            {currentPhase === AppPhase.ADVANCED && <AdvancedPhase data={data} setData={setData} onNext={handleNextPhase} onBack={handleBackPhase} />}
            {currentPhase === AppPhase.REVIEW && <ReviewPhase data={data} setData={setData} onNext={handleNextPhase} onBack={handleBackPhase} />}
          </div>
        )}
        {currentTab === Tab.VAULT && (
          <VaultTab
            vault={vault}
            setVault={setVault}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-2xl lg:max-w-6xl mx-auto bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 px-12 md:px-16 lg:px-24 py-5 lg:py-6 z-50">
        <div className="flex justify-between md:justify-center md:gap-12 lg:gap-24 items-center">
          <NavItem
            label="SCOUT"
            isActive={currentTab === Tab.SCOUT}
            onClick={() => {
              setCurrentTab(Tab.SCOUT);
              setShowSettings(false);
            }}
          />
          <NavItem
            label="VAULT"
            isActive={currentTab === Tab.VAULT}
            onClick={() => {
              setCurrentTab(Tab.VAULT);
              setShowSettings(false);
            }}
          />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 w-20 lg:w-32 group outline-none">
    <div className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-white shadow-[0_0_10px_white] scale-125' : 'bg-transparent'}`}></div>
    <span className={`text-[11px] lg:text-[13px] font-tech font-black tracking-[0.2em] transition-colors ${isActive ? 'text-white' : 'text-white/50 group-active:text-white/80'}`}>{label}</span>
  </button>
);

export default App;