import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { History, Trash2, ChevronLeft, Layers, AlertTriangle } from 'lucide-react';
import { ScoutingData, Alliance } from '../types';
import QRScanner from './QRScanner';
import { compressScoutingData, decompressScoutingData } from '../utils/qrHelper';

interface VaultTabProps {
  vault: ScoutingData[];
  setVault: React.Dispatch<React.SetStateAction<ScoutingData[]>>;
}

const VaultTab: React.FC<VaultTabProps> = ({ vault, setVault }) => {
  const [selected, setSelected] = useState<ScoutingData | null>(null);
  const [showMaster, setShowMaster] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const deleteItem = (id: string) => {
    setVault((prevVault) => prevVault.filter(item => item.id !== id));
    setConfirmingId(null);
  };

  const getMasterData = () => {
    return vault.map(item => compressScoutingData(item));
  };

  const handleScan = (decodedText: string) => {
    try {
      const parsed = JSON.parse(decodedText);
      // Determine if single or master
      // Helper to process one item
      const processItem = (compressedItem: any[]) => {
        const decompressed = decompressScoutingData(compressedItem);
        // Generate new ID
        const newItem: ScoutingData = {
          ...decompressed,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          comments: decompressed.comments || '', // Ensure defaults
          // Fill other potentially missing mandatory fields if not covered by partial
        } as ScoutingData;

        return newItem;
      };

      let newItems: ScoutingData[] = [];

      if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
        // Master QR (Array of Arrays)
        newItems = parsed.map(item => processItem(item));
      } else if (Array.isArray(parsed)) {
        // Single Item
        newItems = [processItem(parsed)];
      }

      setVault(prev => [...newItems, ...prev]);
      setShowScanner(false);
    } catch (e) {
      console.error("Failed to parse QR data", e);
      // In a real app, show a toast or error
      alert("Invalid QR Code format");
    }
  };

  // View: Scanner
  if (showScanner) return (
    <QRScanner
      onScanSuccess={handleScan}
      onClose={() => setShowScanner(false)}
    />
  );

  // View: Single QR for one match
  if (selected) return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <button onClick={() => setSelected(null)} className="mb-6 flex items-center gap-2 text-[10px] font-tech text-white/40 uppercase">
        <ChevronLeft size={14} /> BACK TO ARCHIVE
      </button>
      <div className="bg-white p-5 rounded-3xl mx-auto mb-6 w-fit shadow-2xl">
        <QRCodeSVG
          value={JSON.stringify(compressScoutingData(selected))}
          size={240}
          fgColor="#000"
          bgColor="#fff"
          level="M"
        />
      </div>
      <div className="bg-[#111] p-6 rounded-2xl border border-white/5 text-center">
        <span className="text-[10px] font-tech text-white/30 uppercase block mb-1 tracking-widest">UNIT IDENTIFIED</span>
        <div className="font-tech text-2xl uppercase tracking-tighter">TEAM {selected.teamNumber}</div>
        <div className="text-[10px] font-mono text-white/20 uppercase mt-1 tracking-widest">{selected.matchType} #{selected.matchNumber}</div>
      </div>
    </div>
  );

  // View: Master QR for all matches
  if (showMaster) return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <button onClick={() => setShowMaster(false)} className="mb-6 flex items-center gap-2 text-[10px] font-tech text-white/40 uppercase">
        <ChevronLeft size={14} /> BACK TO ARCHIVE
      </button>
      <div className="bg-white p-5 rounded-3xl mx-auto mb-6 w-fit shadow-2xl">
        <QRCodeSVG
          value={JSON.stringify(getMasterData())}
          size={260}
          fgColor="#000"
          bgColor="#fff"
          level="M"
        />
      </div>
      <div className="bg-purple-500/10 p-6 rounded-2xl border border-purple-500/20 text-center">
        <span className="text-[10px] font-tech text-purple-400/60 uppercase block mb-1 tracking-widest">MASTER SYNC PROTOCOL</span>
        <div className="font-tech text-xl text-purple-400 uppercase tracking-widest">{vault.length} RECORDS COMPRESSED</div>
        <div className="text-[9px] font-mono text-purple-400/30 uppercase mt-2 leading-relaxed">THIS CODE CONTAINS DATA FOR ALL LOGGED MISSIONS IN THE CURRENT ARCHIVE.</div>
      </div>
    </div>
  );

  // View: Archive List
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <History size={16} className="text-white/20" />
          <h2 className="font-tech text-sm tracking-widest uppercase">Archive</h2>
        </div>
        <span className="text-[10px] font-mono text-white/20 uppercase">{vault.length} UNITS LOGGED</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setShowScanner(true)}
          className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group active:bg-white/10 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Trash2 size={16} className="rotate-180" /> {/* Using Trash as icon placeholder if Camera not avail, but better import Camera */}
          </div>
          <div className="font-tech text-[10px] tracking-widest uppercase">Scan Unit</div>
        </button>
        {vault.length > 0 && (
          <button
            onClick={() => setShowMaster(true)}
            className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group active:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers size={16} />
            </div>
            <div className="font-tech text-[10px] tracking-widest uppercase">Master QR</div>
          </button>
        )}
      </div>

      {vault.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/10 gap-4">
          <History size={48} className="opacity-20 stroke-[1px]" />
          <div className="font-tech text-xs uppercase tracking-[0.3em]">No Mission Data</div>
          <button
            onClick={() => setShowScanner(true)}
            className="mt-4 px-6 py-3 bg-blue-500/10 text-blue-400 text-[10px] font-tech uppercase tracking-widest rounded-xl border border-blue-500/20 active:scale-95 transition-all"
          >
            Launch Scanner
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {vault.map((item) => (
            <div key={item.id} className="relative overflow-hidden group">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between group active:bg-white/[0.02] transition-all">
                <div className="flex-1 cursor-pointer" onClick={() => setSelected(item)}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.alliance === Alliance.RED ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}></span>
                    <span className="text-[9px] font-tech text-white/30 uppercase tracking-[0.1em]">{item.matchType} #{item.matchNumber}</span>
                  </div>
                  <div className="font-tech text-lg tracking-tighter uppercase">TEAM {item.teamNumber}</div>
                </div>

                <div className="flex items-center gap-1">
                  {confirmingId === item.id ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="px-3 py-2 text-[8px] font-tech text-white/40 border border-white/10 rounded-lg uppercase tracking-widest active:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-2 text-[8px] font-tech bg-red-500 text-white rounded-lg uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.3)] active:scale-95 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmingId(item.id); }}
                      className="p-3 text-white/10 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultTab;