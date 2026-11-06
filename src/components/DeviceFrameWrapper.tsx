import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCcw } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'iphone' | 'ipad'>('responsive');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 flex flex-col items-center justify-start py-2 sm:py-6 selection:bg-purple-500 selection:text-white">
      {/* Device Mode Switcher Toolbar (Hidden on very small screens or floating at top) */}
      <header aria-label="Geräteansicht-Steuerung" className="w-full max-w-5xl px-4 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 hidden sm:inline">
            Adaptive Geräte-Ansicht:
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#14141E] p-1 rounded-2xl border border-slate-800 shadow-xl mx-auto sm:mx-0">
          <button
            onClick={() => setDeviceMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'responsive'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vollbild Responsive (Automatisch)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto / Full</span>
          </button>

          <button
            onClick={() => setDeviceMode('iphone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'iphone'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="iPhone / Smartphone Ansicht (9:19.5)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone</span>
          </button>

          <button
            onClick={() => setDeviceMode('ipad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'ipad'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="iPad / Tablet Ansicht (4:3)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>iPad</span>
          </button>
        </div>
      </header>

      {/* Main Container framed according to selected device mode */}
      <div
        className={`w-full transition-all duration-500 ${
          deviceMode === 'iphone'
            ? 'max-w-[412px] h-[860px] rounded-[48px] border-[10px] border-[#2A2A3C] shadow-2xl overflow-y-auto bg-[#101018] relative my-auto'
            : deviceMode === 'ipad'
            ? 'max-w-[820px] h-[900px] rounded-[36px] border-[12px] border-[#2A2A3C] shadow-2xl overflow-y-auto bg-[#101018] relative my-auto'
            : 'max-w-6xl mx-auto flex-1'
        }`}
      >
        {/* iPhone Speaker Notch simulation if in iPhone mode */}
        {deviceMode === 'iphone' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2A2A3C] rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-600 rounded-full" />
          </div>
        )}

        <div className={deviceMode === 'iphone' ? 'pt-8' : ''}>{children}</div>
      </div>
    </div>
  );
};
