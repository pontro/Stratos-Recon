import React from 'react';
import { ScoutingData } from '../types';
import { ChevronRight, FastForward, RotateCcw } from 'lucide-react';

interface AdvancedPhaseProps {
  data: ScoutingData;
  setData: (d: ScoutingData) => void;
  onNext: () => void;
  onBack: () => void;
}

const AdvancedPhase: React.FC<AdvancedPhaseProps> = ({ data, setData, onNext, onBack }) => {

  const toggleShooter = (id: number) => {
    let current = [...data.adv_shooter];

    if (id === 4) { // NONE
      setData({ ...data, adv_shooter: current.includes(4) ? [] : [4] });
      return;
    }

    // Logic for restricted combinations:
    // Group A: {0: Turret, 1: Hood, 2: Dual}
    // Group B: {2: Dual, 3: Fixed}

    if (current.includes(id)) {
      // Toggle off
      setData({ ...data, adv_shooter: current.filter(x => x !== id) });
    } else {
      // Toggle on
      let next = current.filter(x => x !== 4); // Always clear 'None' when picking a part

      if (id === 0 || id === 1) {
        // Turret and Hood are incompatible with Fixed (3)
        next = next.filter(x => x !== 3);
        next.push(id);
      } else if (id === 3) {
        // Fixed (3) is incompatible with Turret (0) and Hood (1)
        next = next.filter(x => x !== 0 && x !== 1);
        next.push(id);
      } else if (id === 2) {
        // Dual (2) is compatible with both groups, no clearing needed 
        next.push(id);
      }

      setData({ ...data, adv_shooter: next });
    }
  };

  const handleReset = () => {
    setData({
      ...data,
      adv_field_role: -1,
      adv_hopper_cap: -1,
      adv_chasis: -1,
      adv_intake: -1,
      adv_shooter: [],
      adv_trench: -1,
      adv_broke: -1,
      adv_fixed: -1,
      adv_climber: -1,
      comments: ''
    });
  };

  const handleBrokeChange = (val: number) => {
    if (val === 1) {
      // If it broke down, it can't be fixed (per user request)
      setData({ ...data, adv_broke: val, adv_fixed: 0 });
    } else {
      setData({ ...data, adv_broke: val });
    }
  };

  const OptionButton = ({ label, isActive, onClick, className = "" }: { label: string, isActive: boolean, onClick: () => void, className?: string }) => (
    <button
      onClick={onClick}
      className={`h-20 rounded-2xl border font-tech text-[10px] tracking-widest uppercase transition-all flex flex-col items-center justify-center text-center p-2 ${isActive
        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-[1.02]'
        : 'bg-[#111] border-white/5 text-white/20'
        } ${className}`}
    >
      {label}
    </button>
  );

  // Separate variant for Hardware (purple theme)
  const HardwareButton = ({ label, isActive, onClick, className = "" }: { label: string, isActive: boolean, onClick: () => void, className?: string }) => (
    <button
      onClick={onClick}
      className={`h-20 rounded-2xl border font-tech text-[10px] tracking-widest uppercase transition-all flex flex-col items-center justify-center text-center p-2 ${isActive
        ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.02]'
        : 'bg-[#111] border-white/5 text-white/20'
        } ${className}`}
    >
      {label}
    </button>
  );

  const StatusToggle = ({ label, value, onChange, disableYes = false }: { label: string, value: number, onChange: (v: number) => void, disableYes?: boolean }) => (
    <div className="space-y-3">
      <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">{label}</label>
      <div className="grid grid-cols-2 gap-2 h-20 bg-[#111] rounded-3xl p-2 border border-white/5">
        <button
          onClick={() => !disableYes && onChange(1)}
          disabled={disableYes}
          className={`rounded-2xl text-[10px] font-tech tracking-widest transition-all ${value === 1
            ? 'bg-white text-black shadow-[0_0_15px_white/20]'
            : disableYes
              ? 'text-white/5 cursor-not-allowed'
              : 'text-white/20'
            }`}
        >
          YES
        </button>
        <button
          onClick={() => onChange(0)}
          className={`rounded-2xl text-[10px] font-tech tracking-widest transition-all ${value === 0
            ? 'bg-white text-black shadow-[0_0_15px_white/20]'
            : 'text-white/20'
            }`}
        >
          NO
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
          <h2 className="font-tech text-lg tracking-[0.3em] uppercase">ADVANCED INTEL</h2>
        </div>
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-tech font-black text-white/40 tracking-widest uppercase active:scale-95 transition-all"
        >
          Skip <FastForward size={12} />
        </button>
      </div>

      <div className="flex-1 space-y-10 overflow-y-auto pr-2 custom-scrollbar pb-10">

        {/* Robot Field Role */}
        <div className="space-y-4">
          <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Robot Field Role</label>
          <div className="grid grid-cols-2 gap-3">
            <OptionButton label="SCORER" isActive={data.adv_field_role === 0} onClick={() => setData({ ...data, adv_field_role: 0 })} />
            <OptionButton label="FEEDER" isActive={data.adv_field_role === 1} onClick={() => setData({ ...data, adv_field_role: 1 })} />
            <OptionButton label="DEFENSE" isActive={data.adv_field_role === 2} onClick={() => setData({ ...data, adv_field_role: 2 })} />
            <OptionButton label="NONE" isActive={data.adv_field_role === 3} onClick={() => setData({ ...data, adv_field_role: 3 })} />
          </div>
        </div>

        {/* Hopper Capacity */}
        <div className="space-y-4">
          <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Hopper Capacity</label>
          <div className="grid grid-cols-2 gap-3">
            <OptionButton label="0-20" isActive={data.adv_hopper_cap === 0} onClick={() => setData({ ...data, adv_hopper_cap: 0 })} />
            <OptionButton label="21-40" isActive={data.adv_hopper_cap === 1} onClick={() => setData({ ...data, adv_hopper_cap: 1 })} />
            <OptionButton label="41-60" isActive={data.adv_hopper_cap === 2} onClick={() => setData({ ...data, adv_hopper_cap: 2 })} />
            <OptionButton label="61+" isActive={data.adv_hopper_cap === 3} onClick={() => setData({ ...data, adv_hopper_cap: 3 })} />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5"></div>

        {/* Drivetrain Section */}
        <div className="space-y-4">
          <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Drivetrain (adv_chasis)</label>
          <div className="grid grid-cols-2 gap-3">
            <HardwareButton label="TANK" isActive={data.adv_chasis === 0} onClick={() => setData({ ...data, adv_chasis: 0 })} />
            <HardwareButton label="SWERVE" isActive={data.adv_chasis === 1} onClick={() => setData({ ...data, adv_chasis: 1 })} />
            <HardwareButton label="MECANUM" isActive={data.adv_chasis === 2} onClick={() => setData({ ...data, adv_chasis: 2 })} />
            <HardwareButton label="CUSTOM" isActive={data.adv_chasis === 3} onClick={() => setData({ ...data, adv_chasis: 3 })} />
          </div>
        </div>

        {/* Intake Section */}
        <div className="space-y-4">
          <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Intake Type (adv_intake)</label>
          <div className="grid grid-cols-3 gap-3">
            <HardwareButton label="OVER BUMPER" isActive={data.adv_intake === 0} onClick={() => setData({ ...data, adv_intake: 0 })} />
            <HardwareButton label="UNDER BUMPER" isActive={data.adv_intake === 1} onClick={() => setData({ ...data, adv_intake: 1 })} />
            <HardwareButton label="NONE" isActive={data.adv_intake === 2} onClick={() => setData({ ...data, adv_intake: 2 })} />
          </div>
        </div>

        {/* Shooter Specs - RESTRICTED MULTI SELECT */}
        <div className="space-y-4">
          <div className="flex justify-between items-end ml-2">
            <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase">Shooter Specs (adv_shooter)</label>
            <span className="text-[9px] font-mono text-white/20">VALID COMBOS ONLY</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HardwareButton label="TURRET" isActive={data.adv_shooter.includes(0)} onClick={() => toggleShooter(0)} />
            <HardwareButton label="HOOD" isActive={data.adv_shooter.includes(1)} onClick={() => toggleShooter(1)} />
            <HardwareButton label="DUAL" isActive={data.adv_shooter.includes(2)} onClick={() => toggleShooter(2)} />
            <HardwareButton label="FIXED ANGLE" isActive={data.adv_shooter.includes(3)} onClick={() => toggleShooter(3)} />
            <HardwareButton label="NONE" className="col-span-2" isActive={data.adv_shooter.includes(4)} onClick={() => toggleShooter(4)} />
          </div>
        </div>

        {/* Obstacle Handling */}
        <div className="space-y-4">
          <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Obstacle Tech (adv_trench)</label>
          <div className="grid grid-cols-2 gap-3">
            <HardwareButton label="TRENCH" isActive={data.adv_trench === 0} onClick={() => setData({ ...data, adv_trench: 0 })} />
            <HardwareButton label="BUMP" isActive={data.adv_trench === 1} onClick={() => setData({ ...data, adv_trench: 1 })} />
            <HardwareButton label="BOTH" isActive={data.adv_trench === 2} onClick={() => setData({ ...data, adv_trench: 2 })} />
            <HardwareButton label="NONE" isActive={data.adv_trench === 3} onClick={() => setData({ ...data, adv_trench: 3 })} />
          </div>
        </div>

        {/* Binary/Ternary Indicators */}
        <div className="space-y-6 pt-4 border-t border-white/5">
          <StatusToggle label="CLIMBER INSTALLED" value={data.adv_climber} onChange={(v) => setData({ ...data, adv_climber: v })} />
          <StatusToggle label="BROKE DOWN" value={data.adv_broke} onChange={handleBrokeChange} />
          <StatusToggle
            label="FIXED IN MATCH"
            value={data.adv_fixed}
            onChange={(v) => setData({ ...data, adv_fixed: v })}
            disableYes={data.adv_broke === 1}
          />
        </div>

        <textarea
          placeholder="ADDITIONAL RECON NOTES..."
          value={data.comments}
          maxLength={50}
          onChange={(e) => setData({ ...data, comments: e.target.value.slice(0, 50) })}
          className="w-full h-24 bg-[#111]/50 border border-white/5 rounded-3xl p-6 text-[11px] font-mono focus:outline-none placeholder:text-white/5 resize-none"
        />

        {/* Reset Button - SPECIFIC TO THIS SCREEN */}
        <button
          onClick={handleReset}
          className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500/50 font-tech text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/5 active:scale-[0.98] transition-all uppercase"
        >
          <RotateCcw size={14} />
          Reset Phase Values
        </button>
      </div>

      <div className="pt-6 flex gap-3 bg-[#0c0c0c] z-10">
        <button
          onClick={onBack}
          className="w-[30%] py-5 rounded-full border border-white/10 text-white/40 font-tech font-black text-[12px] tracking-[0.2em] active:scale-[0.98] transition-all uppercase"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-5 rounded-full bg-white text-black font-tech font-black text-[14px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all uppercase"
        >
          Final Phase
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdvancedPhase;