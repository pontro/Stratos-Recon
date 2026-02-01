import React from 'react';
import { ScoutingData } from '../types';
import { ChevronRight } from 'lucide-react';

interface AutoPhaseProps {
  data: ScoutingData;
  setData: (d: ScoutingData) => void;
  onNext: () => void;
  onBack: () => void;
}

const AutoPhase: React.FC<AutoPhaseProps> = ({ data, setData, onNext, onBack }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setData({ ...data, autoFuelPoints: val === '' ? 0 : parseInt(val, 10) });
  };

  const setIsActive = (active: boolean) => {
    if (!active) {
      // Reset dependent fields if robot is inactive
      setData({
        ...data,
        isActiveInAuto: false,
        autoHang: false,
        autoFuelPoints: 0
      });
    } else {
      setData({ ...data, isActiveInAuto: true });
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex-1 space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 lg:h-8 bg-white"></div>
          <h2 className="font-tech text-lg lg:text-xl tracking-[0.3em] uppercase">PHASE: AUTO</h2>
        </div>

        <div className="space-y-8">
          {/* Active Toggle */}
          <div className="space-y-3">
            <label className="text-[11px] font-tech font-bold tracking-[0.2em] uppercase text-white/40 ml-2">Active in Auto?</label>
            <div className="flex bg-[#111] rounded-3xl p-2 border border-white/5 h-20 lg:h-24">
              <button
                onClick={() => setIsActive(true)}
                className={`flex-1 rounded-2xl text-sm lg:text-base font-tech font-bold tracking-widest transition-all ${data.isActiveInAuto ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/50'}`}
              >
                YES
              </button>
              <button
                onClick={() => setIsActive(false)}
                className={`flex-1 rounded-2xl text-sm lg:text-base font-tech font-bold tracking-widest transition-all ${!data.isActiveInAuto ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/50'}`}
              >
                NO
              </button>
            </div>
          </div>

          {data.isActiveInAuto && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Autonomous Hang Toggle */}
              <div className="space-y-3">
                <label className="text-[11px] font-tech font-bold tracking-[0.2em] uppercase text-white/40 ml-2">Autonomous Hang?</label>
                <div className="flex bg-[#111] rounded-3xl p-2 border border-white/5 h-20 lg:h-24">
                  <button
                    onClick={() => setData({ ...data, autoHang: true })}
                    className={`flex-1 rounded-2xl text-sm lg:text-base font-tech tracking-widest transition-all ${data.autoHang ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/50'}`}
                  >
                    YES
                  </button>
                  <button
                    onClick={() => setData({ ...data, autoHang: false })}
                    className={`flex-1 rounded-2xl text-sm lg:text-base font-tech tracking-widest transition-all ${!data.autoHang ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/50'}`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {/* Fuel Points Counter */}
              <div className="space-y-3">
                <label className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase ml-2">Auto Fuel Points</label>
                <div className="flex items-center gap-2 lg:gap-3 h-20 lg:h-24">
                  <button
                    onClick={() => setData({ ...data, autoFuelPoints: Math.max(0, data.autoFuelPoints - 1) })}
                    className="w-16 lg:w-20 h-full rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-center font-tech text-2xl lg:text-3xl active:bg-white active:text-black transition-all"
                  >
                    -
                  </button>

                  <div className="flex-1 h-full bg-[#161616] rounded-2xl border border-white/5 flex items-center justify-center group focus-within:border-white/20 transition-all overflow-hidden">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={data.autoFuelPoints === 0 ? '' : data.autoFuelPoints}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="bg-transparent text-3xl lg:text-4xl font-tech text-center w-full focus:outline-none placeholder:text-white/10 text-white"
                    />
                  </div>

                  <button
                    onClick={() => setData({ ...data, autoFuelPoints: data.autoFuelPoints + 1 })}
                    className="w-16 lg:w-20 h-full rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-center font-tech text-2xl lg:text-3xl active:bg-white active:text-black transition-all"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => setData({ ...data, autoFuelPoints: data.autoFuelPoints + 2 })}
                    className="w-16 lg:w-20 h-full rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-center font-tech text-2xl lg:text-3xl active:bg-white active:text-black transition-all"
                  >
                    +2
                  </button>
                </div>
              </div>
            </div>
          )}

          <textarea
            placeholder="AUTO NOTES..."
            value={data.autoComments}
            maxLength={50}
            onChange={(e) => setData({ ...data, autoComments: e.target.value.slice(0, 50) })}
            className="w-full h-24 lg:h-28 bg-[#111]/50 border border-white/5 rounded-3xl p-6 text-xs md:text-sm lg:text-base font-mono focus:outline-none resize-none placeholder:text-white/5"
          />
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3 lg:gap-4">
        <button
          onClick={onBack}
          className="w-[30%] py-5 lg:py-6 rounded-full border border-white/10 text-white/40 font-tech font-black text-[12px] lg:text-sm tracking-[0.2em] active:scale-[0.98] transition-all uppercase"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-5 lg:py-6 rounded-full bg-white text-black font-tech font-black text-[14px] lg:text-base tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all uppercase"
        >
          Next Phase
          <ChevronRight size={18} className="lg:w-5 lg:h-5" />
        </button>
      </div>
    </div>
  );
};

export default AutoPhase;