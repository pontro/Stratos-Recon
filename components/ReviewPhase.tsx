import React from 'react';
import { ScoutingData, Alliance } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface ReviewPhaseProps {
  data: ScoutingData;
  setData: (d: ScoutingData) => void;
  onNext: () => void;
  onBack: () => void;
}

const ReviewPhase: React.FC<ReviewPhaseProps> = ({ data, setData, onNext, onBack }) => {

  const SummaryItem = ({ label, value, colorClass = "text-white" }: { label: string, value: string | number | boolean, colorClass?: string }) => (
    <div className="flex justify-between items-center py-3 border-b border-white/5">
      <span className="text-[11px] font-tech font-bold text-white/30 uppercase tracking-[0.2em]">{label}</span>
      <span className={`text-[11px] font-mono font-bold uppercase ${colorClass}`}>
        {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}
      </span>
    </div>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <h3 className="text-[11px] font-tech font-bold text-white/60 tracking-[0.2em] uppercase mt-6 mb-2">{label}</h3>
  );

  const getRoleLabel = (val: number) => ["SCORER", "FEEDER", "DEFENSE", "NONE"][val] || "N/A";
  const getHopperLabel = (val: number) => ["0-20", "21-40", "41-60", "61+"][val] || "N/A";
  const getChassisLabel = (val: number) => ["TANK", "SWERVE", "MECANUM", "CUSTOM"][val] || "N/A";
  const getIntakeLabel = (val: number) => ["OVER BUMPER", "UNDER BUMPER", "NONE"][val] || "N/A";
  const getTrenchLabel = (val: number) => ["TRENCH", "BUMP", "BOTH", "NONE"][val] || "N/A";

  const getShooterLabels = (ids: number[]) => {
    if (ids.length === 0) return "NONE";
    if (ids.includes(4)) return "NONE";
    const map: Record<number, string> = { 0: "TURRET", 1: "HOOD", 2: "DUAL", 3: "FIXED" };
    return ids.map(id => map[id]).filter(Boolean).join(" + ");
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 lg:h-8 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        <h2 className="font-tech text-lg lg:text-xl tracking-[0.3em] uppercase">MISSION REVIEW</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 space-y-2">

        {/* MATCH METRICS */}
        <div className="bg-white/5 rounded-3xl p-6 lg:p-8 border border-white/5 mb-4">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-[11px] font-tech font-bold text-white/30 uppercase tracking-[0.2em] mb-1">TEAM UNIT</div>
              <div className="text-3xl lg:text-4xl font-tech tracking-tighter">{data.teamNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-tech font-bold text-white/30 uppercase tracking-[0.2em] mb-1">SCOUTER / MATCH</div>
              <div className="text-xl lg:text-2xl font-tech text-white/60">{data.scouter} <span className="text-xs lg:text-sm text-white/30">#{data.matchNumber}</span></div>
            </div>
          </div>
          <SummaryItem label="Alliance" value={data.alliance} colorClass={data.alliance === Alliance.RED ? 'text-red-500' : 'text-blue-500'} />
          <SummaryItem label="Start Zone" value={data.startingZone} />
        </div>

        {/* PHASE SUMMARIES */}
        <SectionHeader label="Autonomous Phase" />
        <SummaryItem label="Active" value={data.isActiveInAuto} />
        <SummaryItem label="Auto Hang" value={data.autoHang} />
        <SummaryItem label="Fuel Points" value={data.autoFuelPoints} colorClass="text-green-400" />

        <SectionHeader label="Teleop Phase" />
        <SummaryItem label="Fuel Points" value={data.teleopFuelPoints} colorClass="text-green-400" />
        <SummaryItem label="Climb Level" value={data.climbLevel === 0 ? '0' : `L${data.climbLevel}`} />

        <SectionHeader label="Advanced Intel" />
        <SummaryItem label="Role" value={getRoleLabel(data.adv_field_role)} />
        <SummaryItem label="Hopper Cap" value={getHopperLabel(data.adv_hopper_cap)} />
        <SummaryItem label="Chassis" value={getChassisLabel(data.adv_chasis)} />
        <SummaryItem label="Intake" value={getIntakeLabel(data.adv_intake)} />
        <SummaryItem label="Shooter" value={getShooterLabels(data.adv_shooter)} />
        <SummaryItem label="Obstacle Tech" value={getTrenchLabel(data.adv_trench)} />
        <SummaryItem label="Climber" value={data.adv_climber === 1 ? 'YES' : data.adv_climber === 0 ? 'NO' : 'N/A'} />
        <SummaryItem label="Broke Down" value={data.adv_broke === 1 ? 'YES' : data.adv_broke === 0 ? 'NO' : 'N/A'} colorClass={data.adv_broke === 1 ? 'text-red-500' : ''} />
        <SummaryItem label="Fixed" value={data.adv_fixed === 1 ? 'YES' : data.adv_fixed === 0 ? 'NO' : 'N/A'} colorClass={data.adv_fixed === 1 ? 'text-green-500' : ''} />
      </div>

      <div className="pt-6 flex gap-3 lg:gap-4 bg-[#0c0c0c] z-10">
        <button
          onClick={onBack}
          className="w-[30%] py-5 lg:py-6 rounded-full border border-white/10 text-white/40 font-tech font-black text-[12px] lg:text-sm tracking-[0.2em] active:scale-[0.98] transition-all uppercase"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-5 lg:py-6 rounded-full bg-green-500 text-black font-tech font-black text-[14px] lg:text-base tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] active:scale-[0.98] transition-all uppercase"
        >
          Finalize & Save
          <CheckCircle2 size={18} className="lg:w-5 lg:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ReviewPhase;