import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ScoutingData, MatchType, StartingZone, Alliance } from '../types';

interface SetupPhaseProps {
  data: ScoutingData;
  setData: (data: ScoutingData) => void;
  onNext: () => void;
}

const SetupPhase: React.FC<SetupPhaseProps> = ({ data, setData, onNext }) => {
  const updateVal = (key: keyof ScoutingData, val: any) => setData({ ...data, [key]: val });

  const handleNumericInput = (key: keyof ScoutingData, value: string, maxLength: number) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, maxLength);
    updateVal(key, numericValue);
  };

  const handleAlphaInput = (key: keyof ScoutingData, value: string) => {
    const alphaValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
    updateVal(key, alphaValue);
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        {/* Unit Identity */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-tech text-white/40 tracking-[0.2em] uppercase ml-2">Team</label>
              <div className="bg-[#161616] rounded-2xl border border-white/5 h-16 flex items-center justify-center focus-within:border-white/20 transition-all">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.teamNumber}
                  placeholder="0"
                  onChange={(e) => handleNumericInput('teamNumber', e.target.value, 5)}
                  className="bg-transparent text-2xl font-tech text-center w-full focus:outline-none placeholder:text-white/5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-tech text-white/40 tracking-[0.2em] uppercase ml-2">Match</label>
              <div className="bg-[#161616] rounded-2xl border border-white/5 h-16 flex items-center justify-center focus-within:border-white/20 transition-all">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.matchNumber}
                  placeholder="0"
                  onChange={(e) => handleNumericInput('matchNumber', e.target.value, 3)}
                  className="bg-transparent text-2xl font-tech text-center w-full focus:outline-none placeholder:text-white/5"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-tech text-white/40 tracking-[0.2em] uppercase ml-2">Scouter ID</label>
            <div className="bg-[#161616] rounded-2xl border border-white/5 h-16 flex items-center justify-center focus-within:border-white/20 transition-all">
              <input
                type="text"
                value={data.scouter}
                placeholder="INITIALS"
                onChange={(e) => handleAlphaInput('scouter', e.target.value)}
                className="bg-transparent text-2xl font-tech text-center w-full focus:outline-none placeholder:text-white/5 tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* Match Protocol */}
        <div className="space-y-2">
          <label className="text-[11px] font-tech text-white/40 tracking-[0.2em] uppercase ml-2">Match Protocol</label>
          <div className="grid grid-cols-3 gap-2">
            {[MatchType.PRACTICE, MatchType.QUALIFICATION, MatchType.PLAYOFF].map((type) => (
              <button
                key={type}
                onClick={() => updateVal('matchType', type)}
                className={`py-4 rounded-xl text-[10px] font-tech tracking-widest border transition-all ${data.matchType === type
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'bg-[#161616] text-white/20 border-white/5'
                  }`}
              >
                {type === MatchType.QUALIFICATION ? 'QUAL' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Deployment Zone */}
        <div className="space-y-2">
          <label className="text-[11px] font-tech text-white/40 tracking-[0.2em] uppercase ml-2">Deployment Zone</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: StartingZone.DEPOT, num: '1', label: 'DEPOT' },
              { id: StartingZone.CENTER, num: '2', label: 'CENTER' },
              { id: StartingZone.OUTPOST, num: '3', label: 'OUTPOST' }
            ].map((zone) => (
              <button
                key={zone.id}
                onClick={() => updateVal('startingZone', zone.id)}
                className={`py-4 rounded-2xl flex flex-col items-center justify-center transition-all border ${data.startingZone === zone.id
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'bg-[#161616] text-white/20 border-white/5 active:border-white/10'
                  }`}
              >
                <span className="font-tech text-2xl font-bold leading-none">{zone.num}</span>
                <span className={`text-[10px] font-tech tracking-wider mt-1 font-bold ${data.startingZone === zone.id ? 'opacity-100' : 'opacity-40'}`}>
                  {zone.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Alliance Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateVal('alliance', Alliance.RED)}
            className={`py-5 rounded-2xl font-tech text-sm tracking-widest border transition-all ${data.alliance === Alliance.RED
              ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
              : 'bg-[#161616] border-white/5 text-white/10'
              }`}
          >
            RED
          </button>
          <button
            onClick={() => updateVal('alliance', Alliance.BLUE)}
            className={`py-5 rounded-2xl font-tech text-sm tracking-widest border transition-all ${data.alliance === Alliance.BLUE
              ? 'bg-blue-500/10 border-blue-500 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
              : 'bg-[#161616] border-white/5 text-white/10'
              }`}
          >
            BLUE
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button
          onClick={onNext}
          disabled={!data.teamNumber || !data.matchNumber || !data.scouter}
          className="w-full py-5 rounded-full bg-white text-black font-tech text-[14px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-20 active:scale-[0.98] transition-all uppercase"
        >
          INITIATE MISSION
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SetupPhase;