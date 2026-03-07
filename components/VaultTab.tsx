import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { History, Trash2, ChevronLeft, Layers, AlertTriangle, Camera, Upload, Download, Settings } from 'lucide-react';
import { ScoutingData, Alliance } from '../types';
import QRScanner from './QRScanner';
import { compressScoutingData, decompressScoutingData } from '../utils/qrHelper';
import { detectPlatform, Platform } from '../utils/platformDetector';
import { generateCSV, pushCSVToPC, getEndpoint, setEndpoint } from '../utils/csvExporter';

interface VaultTabProps {
  vault: ScoutingData[];
  setVault: React.Dispatch<React.SetStateAction<ScoutingData[]>>;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const VaultTab: React.FC<VaultTabProps> = ({ vault, setVault, showSettings, setShowSettings }) => {
  const [selected, setSelected] = useState<ScoutingData | null>(null);
  const [showMaster, setShowMaster] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);
  const [confirmingExport, setConfirmingExport] = useState(false);
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [exportStatus, setExportStatus] = useState<string>('');
  const [endpointInput, setEndpointInput] = useState<string>('');

  const deleteItem = (id: string) => {
    setVault((prevVault) => prevVault.filter(item => item.id !== id));
    setConfirmingId(null);
  };

  const clearAll = () => {
    setVault([]);
    setConfirmingClearAll(false);
  };

  const getMasterData = () => {
    return vault.map(item => compressScoutingData(item));
  };

  // Detect platform on mount
  useEffect(() => {
    setPlatform(detectPlatform());
    setEndpointInput(getEndpoint());
  }, []);

  // Save endpoint settings
  const handleSaveEndpoint = () => {
    if (endpointInput.trim()) {
      setEndpoint(endpointInput.trim());
      setShowSettings(false);
    }
  };

  // Push Export Handler
  const handlePushExport = async () => {
    if (vault.length === 0) {
      setExportStatus('No data to export');
      setTimeout(() => setExportStatus(''), 2000);
      return;
    }

    setConfirmingExport(false);
    setExportStatus('Pushing CSV...');
    const csvContent = generateCSV(vault);
    const endpoint = getEndpoint();
    const result = await pushCSVToPC(csvContent, endpoint);

    setExportStatus(result.message);
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Download Export Handler - Downloads CSV file
  const handleDownloadExport = () => {
    if (vault.length === 0) {
      setExportStatus('No data to export');
      setTimeout(() => setExportStatus(''), 2000);
      return;
    }

    setExportStatus('Generating CSV...');

    try {
      // Generate CSV content
      const csvContent = generateCSV(vault);

      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create a download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `scouting_data_${timestamp}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      setExportStatus('CSV downloaded successfully');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('[Download Export] Error:', error);
      setExportStatus('Export failed');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  // Label Helpers
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

  const SectionHeader = ({ label }: { label: string }) => (
    <h3 className="text-[11px] font-tech font-bold text-white/40 tracking-[0.2em] uppercase mt-6 mb-2 ml-1">{label}</h3>
  );

  const SummaryItem = ({ label, value, colorClass = "text-white/70" }: { label: string, value: string | number | boolean, colorClass?: string }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5">
      <span className="text-[10px] font-tech font-bold text-white/20 uppercase tracking-widest">{label}</span>
      <span className={`text-[11px] font-mono font-bold uppercase ${colorClass}`}>
        {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}
      </span>
    </div>
  );

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

  // View: Settings
  if (showSettings) return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <button onClick={() => setShowSettings(false)} className="mb-6 flex items-center gap-2 text-[10px] font-tech text-white/40 uppercase">
        <ChevronLeft size={14} /> BACK TO ARCHIVE
      </button>

      <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Settings size={16} className="text-white/40" />
            <h3 className="font-tech font-bold text-sm tracking-widest uppercase">Export Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-tech text-white/40 uppercase tracking-widest block mb-2">
                Server URL
              </label>
              <input
                type="text"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                placeholder="http://192.168.1.100:8080"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <button
              onClick={handleSaveEndpoint}
              disabled={!endpointInput.trim()}
              className="w-full bg-green-500 text-white font-tech text-[10px] uppercase tracking-widest py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              Save Server URL
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <p className="text-[11px] font-mono text-white/60 mb-4">
            Stratos Recon is the client side of Stratos Scout
          </p>
          <div className="space-y-2 text-[10px] font-tech text-white/50 uppercase tracking-widest">
            <p>check this videos for further explanation:</p>
            <div className="flex gap-4">
              <a href="https://youtu.be/rFPGw5TqOd0" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 underline-offset-4">Stratos Recon Video</a>
              <a href="https://youtu.be/E3YwWn1R15E" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 underline-offset-4">Stratos Scout Video</a>
            </div>
            <p className="pt-2">
              Stratos Scout github: <a href="https://github.com/katyazano/scouting2026" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-400/30 underline-offset-4">github.com/katyazano/scouting2026</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // View: Single QR for one match
  if (selected) return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <button onClick={() => setSelected(null)} className="mb-6 flex items-center gap-2 text-[10px] font-tech text-white/40 uppercase">
        <ChevronLeft size={14} /> BACK TO ARCHIVE
      </button>
      <div className="bg-white p-5 lg:p-6 rounded-3xl mx-auto mb-6 w-fit shadow-2xl">
        <QRCodeSVG
          value={JSON.stringify(compressScoutingData(selected))}
          size={240}
          className="lg:w-80 lg:h-80"
          fgColor="#000"
          bgColor="#fff"
          level="M"
        />
      </div>
      <div className="bg-[#111] p-6 rounded-2xl border border-white/5 text-center mb-6">
        <span className="text-[11px] font-tech font-bold text-white/30 uppercase block mb-1 tracking-[0.2em]">UNIT IDENTIFIED</span>
        <div className="font-tech text-2xl uppercase tracking-tighter">TEAM {selected.teamNumber}</div>
        <div className="text-[10px] font-mono text-white/20 uppercase mt-1 tracking-widest">{selected.matchType} #{selected.matchNumber}</div>
      </div>

      <div className="space-y-2 pb-12">
        <SectionHeader label="Autonomous Phase" />
        <SummaryItem label="Active" value={selected.isActiveInAuto} />
        <SummaryItem label="Auto Hang" value={selected.autoHang} />
        <SummaryItem label="Fuel Points" value={selected.autoFuelPoints} colorClass="text-green-400" />

        <SectionHeader label="Teleop Phase" />
        <SummaryItem label="Fuel Points" value={selected.teleopFuelPoints} colorClass="text-green-400" />
        <SummaryItem label="Climb Level" value={selected.climbLevel === 0 ? '0' : `L${selected.climbLevel}`} />

        <SectionHeader label="Advanced Intel" />
        <SummaryItem label="Role" value={getRoleLabel(selected.adv_field_role)} />
        <SummaryItem label="Hopper Cap" value={getHopperLabel(selected.adv_hopper_cap)} />
        <SummaryItem label="Chassis" value={getChassisLabel(selected.adv_chasis)} />
        <SummaryItem label="Intake" value={getIntakeLabel(selected.adv_intake)} />
        <SummaryItem label="Shooter" value={getShooterLabels(selected.adv_shooter)} />
        <SummaryItem label="Obstacle Tech" value={getTrenchLabel(selected.adv_trench)} />
        <SummaryItem label="Climber" value={selected.adv_climber === 1 ? 'YES' : selected.adv_climber === 0 ? 'NO' : 'N/A'} />
        <SummaryItem label="Broke Down" value={selected.adv_broke === 1 ? 'YES' : selected.adv_broke === 0 ? 'NO' : 'N/A'} colorClass={selected.adv_broke === 1 ? 'text-red-500' : ''} />
        <SummaryItem label="Fixed" value={selected.adv_fixed === 1 ? 'YES' : selected.adv_fixed === 0 ? 'NO' : 'N/A'} colorClass={selected.adv_fixed === 1 ? 'text-green-500' : ''} />

        {selected.comments && (
          <>
            <SectionHeader label="Scouter Notes" />
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-mono text-white/40 leading-relaxed italic">
              "{selected.comments}"
            </div>
          </>
        )}
      </div>
    </div>
  );

  // View: Master QR for all matches
  if (showMaster) return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <button onClick={() => setShowMaster(false)} className="mb-6 flex items-center gap-2 text-[10px] font-tech text-white/40 uppercase">
        <ChevronLeft size={14} /> BACK TO ARCHIVE
      </button>
      <div className="bg-white p-5 lg:p-6 rounded-3xl mx-auto mb-6 w-fit shadow-2xl">
        <QRCodeSVG
          value={JSON.stringify(getMasterData())}
          size={260}
          className="lg:w-96 lg:h-96"
          fgColor="#000"
          bgColor="#fff"
          level="M"
        />
      </div>
      <div className="bg-purple-500/10 p-6 rounded-2xl border border-purple-500/20 text-center">
        <span className="text-[11px] font-tech font-bold text-purple-400/60 uppercase block mb-1 tracking-[0.2em]">MASTER SYNC PROTOCOL</span>
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
          <History size={16} className="text-white/50" />
          <h2 className="font-tech font-bold text-sm tracking-widest uppercase">Archive</h2>
        </div>
        <div className="flex items-center gap-4">
          {vault.length > 0 && (
            confirmingClearAll ? (
              <div className="flex items-center gap-3 animate-in slide-in-from-right-2 duration-200">
                <button
                  onClick={() => setConfirmingClearAll(false)}
                  className="text-[10px] font-tech text-white/50 uppercase tracking-widest hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAll}
                  className="text-[10px] font-tech text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20"
                >
                  Confirm Erase
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingClearAll(true)}
                className="flex items-center gap-1.5 text-[10px] font-tech text-white/40 uppercase tracking-widest hover:text-red-400 transition-colors group"
              >
                <Trash2 size={12} className="group-hover:text-red-400 transition-colors" />
                Clear All
              </button>
            )
          )}
          <span className="text-[10px] font-mono text-white/50 uppercase">{vault.length} UNITS LOGGED</span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowScanner(true)}
          className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center gap-2 group active:bg-white/10 transition-all"
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Camera size={16} className="lg:w-5 lg:h-5" />
          </div>
          <div className="font-tech font-bold text-[10px] lg:text-[11px] tracking-widest uppercase">Scan Unit</div>
        </button>
        {vault.length > 0 && (
          <button
            onClick={() => setShowMaster(true)}
            className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center gap-2 group active:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers size={16} className="lg:w-5 lg:h-5" />
            </div>
            <div className="font-tech font-bold text-[10px] lg:text-[11px] tracking-widest uppercase">Master QR</div>
          </button>
        )}
      </div>

      {/* Export Section - All platforms now see both options */}
      {vault.length > 0 && (
        <div className="mb-4">
          <div className="space-y-3">
            {confirmingExport ? (
              <div className="w-full bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                <span className="text-[10px] font-tech font-bold text-green-400/80 uppercase tracking-widest">Push {vault.length} record{vault.length !== 1 ? 's' : ''} to PC?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmingExport(false)}
                    className="px-3 py-2 text-[8px] font-tech font-bold text-white/40 border border-white/10 rounded-lg uppercase tracking-widest active:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePushExport}
                    className="px-3 py-2 text-[8px] font-tech font-bold bg-green-500 text-white rounded-lg uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.3)] active:scale-95 transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingExport(true)}
                className="w-full bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center justify-center gap-3 group active:bg-green-500/20 transition-all font-bold"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <Upload size={16} />
                </div>
                <div className="font-tech font-bold text-[11px] tracking-widest uppercase text-green-400">Push CSV to PC</div>
              </button>
            )}

            <button
              onClick={handleDownloadExport}
              className="w-full bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-center gap-3 group active:bg-blue-500/20 transition-all font-bold"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Download size={16} />
              </div>
              <div className="font-tech font-bold text-[11px] tracking-widest uppercase text-blue-400">Download CSV</div>
            </button>
          </div>

          {exportStatus && (
            <div className="mt-2 text-center text-[10px] font-mono text-white/60 animate-in fade-in duration-200">
              {exportStatus}
            </div>
          )}
        </div>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
          {vault.map((item) => (
            <div key={item.id} className="relative overflow-hidden group">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between group active:bg-white/[0.02] transition-all">
                <div className="flex-1 cursor-pointer" onClick={() => setSelected(item)}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.alliance === Alliance.RED ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}></span>
                    <span className="text-[9px] font-tech text-white/50 uppercase tracking-[0.1em]">{item.matchType} #{item.matchNumber}</span>
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