
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ScoutingData } from '../types';
import { compressScoutingData } from '../utils/qrHelper';

interface FinishPhaseProps {
  data: ScoutingData;
  onRestart: () => void;
}

const FinishPhase: React.FC<FinishPhaseProps> = ({ data, onRestart }) => (
  <div className="flex flex-col items-center justify-center space-y-6 pt-6 animate-in zoom-in-95 duration-500">
    <div className="relative">
      <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
      <div className="bg-white p-5 rounded-3xl relative shadow-2xl">
        <QRCodeSVG 
          value={JSON.stringify(compressScoutingData(data))} 
          size={200} 
          level="H" 
          includeMargin={false} 
          fgColor="#000" 
          bgColor="#fff" 
        />
      </div>
    </div>
    <div className="text-center space-y-1">
      <h3 className="font-tech text-lg text-green-400 uppercase tracking-widest">MISSION LOGGED</h3>
      <p className="text-[10px] font-mono text-white/30 uppercase">Unit {data.teamNumber} • Match #{data.matchNumber}</p>
    </div>
    <button onClick={onRestart} className="w-full max-w-[200px] py-4 rounded-full border border-white/10 font-tech text-[10px] tracking-widest active:bg-white/10 transition-all uppercase">START NEW SESSION</button>
  </div>
);

export default FinishPhase;
