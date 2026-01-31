import React from 'react';
import { ScoutingData } from '../types';
import { ChevronRight } from 'lucide-react';

interface TeleopPhaseProps {
  data: ScoutingData;
  setData: (d: ScoutingData) => void;
  onNext: () => void;
  onBack: () => void;
}

const TeleopPhase: React.FC<TeleopPhaseProps> = ({ data, setData, onNext, onBack }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const val = e.target.value.replace(/[^0-9]/g, '');
    // Convert to number, default to 0 if empty
    setData({ ...data, teleopFuelPoints: val === '' ? 0 : parseInt(val, 10) });
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-white"></div>
          <h2 className="font-tech text-lg tracking-[0.3em] uppercase">TELEOPERATED</h2>
        </div>

        <div className="space-y-8">
          {/* Climb Level - Displayed as 0, L1, L2, L3 */}
          <div className="space-y-3">
            <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Climb Level</label>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => setData({ ...data, climbLevel: level })}
                  className={`h-24 rounded-3xl flex items-center justify-center font-tech font-bold text-2xl border transition-all ${data.climbLevel === level ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-[#111] text-white/20 border-white/5'}`}
                >
                  {level === 0 ? '0' : `L${level}`}
                </button>
              ))}
            </div>
          </div>

          {/* Teleop Fuel Points - MATCHES AUTO STYLE & RULES */}
          <div className="space-y-3">
            <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Teleop Fuel Points</label>
            <div className="flex items-center gap-2 h-20">
              <button
                onClick={() => setData({ ...data, teleopFuelPoints: Math.max(0, data.teleopFuelPoints - 1) })}
                className="w-16 h-full rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-center font-tech text-2xl active:bg-white active:text-black transition-all"
              >
                -
              </button>

              <div className="flex-1 h-full bg-[#161616] rounded-2xl border border-white/5 flex items-center justify-center group focus-within:border-white/20 transition-all overflow-hidden">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.teleopFuelPoints === 0 ? '' : data.teleopFuelPoints}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-transparent text-3xl font-tech text-center w-full focus:outline-none placeholder:text-white/10 text-white"
                />
              </div>

              <button
                onClick={() => setData({ ...data, teleopFuelPoints: data.teleopFuelPoints + 1 })}
                className="w-16 h-full rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-center font-tech text-2xl active:bg-white active:text-black transition-all"
              >
                +1
              </button>
              <button
                onClick={() => setData({ ...data, teleopFuelPoints: data.teleopFuelPoints + 2 })}
                className="w-16 h-full rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-center font-tech text-2xl active:bg-white active:text-black transition-all"
              >
                +2
              </button>
            </div>
          </div>

          <textarea
            placeholder="STRATEGY SHIFTS..."
            value={data.teleopComments}
            maxLength={50}
            onChange={(e) => setData({ ...data, teleopComments: e.target.value.slice(0, 50) })}
            className="w-full h-24 bg-[#111]/50 border border-white/5 rounded-3xl p-6 text-[11px] font-mono focus:outline-none placeholder:text-white/5 resize-none"
          />
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
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
          Next Phase
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TeleopPhase;