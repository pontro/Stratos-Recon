import React, { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const regionId = "reader";

    useEffect(() => {
        const startScanning = async () => {
            try {
                // 1. Check supported
                try {
                    await Html5Qrcode.getCameras();
                } catch (e: any) {
                    throw new Error("Permission denied or no cameras found. " + e?.message);
                }

                const scanner = new Html5Qrcode(regionId, {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    verbose: true // Enable verbose logging
                });
                scannerRef.current = scanner;

                // 2. Try environment camera first, then fallback
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                };

                try {
                    await scanner.start({ facingMode: "environment" }, config,
                        (decodedText) => { onScanSuccess(decodedText); stopScanner(); },
                        () => { } // scan failure ignore
                    );
                } catch (envError) {
                    console.warn("Environment camera failed, trying user camera", envError);
                    // Fallback to any camera
                    await scanner.start({ facingMode: "user" }, config,
                        (decodedText) => { onScanSuccess(decodedText); stopScanner(); },
                        () => { }
                    );
                }

            } catch (err: any) {
                console.error("Critical Scanner Error:", err);
                setErrorMsg(JSON.stringify(err?.message || err) + " | Check browser permissions.");
            }
        };

        const stopScanner = async () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                try {
                    await scannerRef.current.stop();
                    scannerRef.current.clear();
                } catch (err) {
                    console.error("Error stopping scanner:", err);
                }
            }
        };

        // Delay slightly to ensure DOM is ready
        const timer = setTimeout(startScanning, 500);

        return () => {
            clearTimeout(timer);
            stopScanner();
        };
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 text-white/50 hover:text-white bg-white/5 rounded-full z-[70] transition-all"
            >
                <X size={24} />
            </button>

            <div className="relative w-full max-w-sm px-6">
                <div className="text-center mb-8">
                    <Camera size={48} className="mx-auto text-purple-400 mb-4 opacity-50" />
                    <h2 className="font-tech text-2xl text-white uppercase tracking-widest mb-2">Scan Unit</h2>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Align QR Code within the frame</p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#111] min-h-[300px]">
                    {errorMsg ? (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                            <div>
                                <p className="text-red-400 font-bold mb-2">Camera Error</p>
                                <p className="text-white/50 text-xs font-mono">{errorMsg}</p>
                            </div>
                        </div>
                    ) : (
                        <div id={regionId} className="w-full h-full [&_video]:object-cover" />
                    )}

                    {/* Custom Overlay UI */}
                    {!errorMsg && (
                        <div className="absolute inset-0 border-[2px] border-purple-500/30 m-12 rounded-xl pointer-events-none">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 -mt-0.5 -ml-0.5"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 -mt-0.5 -mr-0.5"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500 -mb-0.5 -ml-0.5"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 -mb-0.5 -mr-0.5"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
