import React from 'react';
import { Wrench, FastForward, Sparkles, RefreshCw, Unlock } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface DevOverlayProps {
  onUnlockAll: () => void;
  onSkipLevel: () => void;
  onAutoWinPrimary: () => void;
  onAutoWinSecret: () => void;
  onResetLevel: () => void;
}

export const DevOverlay: React.FC<DevOverlayProps> = ({
  onUnlockAll,
  onSkipLevel,
  onAutoWinPrimary,
  onAutoWinSecret,
  onResetLevel,
}) => {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-purple-950/90 backdrop-blur-md border border-purple-400/50 text-white rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-2xl text-xs font-mono">
      <div className="flex items-center gap-1 text-purple-300 font-bold mr-1">
        <Wrench className="w-3.5 h-3.5" />
        <span>DEV</span>
      </div>

      <button
        onClick={() => {
          soundEngine.playTap();
          onUnlockAll();
        }}
        className="px-2 py-1 bg-purple-800 hover:bg-purple-700 active:scale-95 rounded-lg flex items-center gap-1 cursor-pointer"
        title="Unlock All Worlds"
      >
        <Unlock className="w-3 h-3 text-amber-300" />
        <span>Unlock</span>
      </button>

      <button
        onClick={() => {
          soundEngine.playTap();
          onAutoWinPrimary();
        }}
        className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 active:scale-95 rounded-lg flex items-center gap-1 cursor-pointer"
        title="Auto Win Primary"
      >
        <span>Win 1⭐</span>
      </button>

      <button
        onClick={() => {
          soundEngine.playSuccess();
          onAutoWinSecret();
        }}
        className="px-2 py-1 bg-amber-600 hover:bg-amber-500 active:scale-95 rounded-lg flex items-center gap-1 cursor-pointer"
        title="Auto Win Secret 3-Star"
      >
        <Sparkles className="w-3 h-3" />
        <span>Secret 3⭐</span>
      </button>

      <button
        onClick={() => {
          soundEngine.playTap();
          onSkipLevel();
        }}
        className="px-2 py-1 bg-blue-800 hover:bg-blue-700 active:scale-95 rounded-lg flex items-center gap-1 cursor-pointer"
        title="Next Level"
      >
        <FastForward className="w-3 h-3" />
        <span>Skip</span>
      </button>
    </div>
  );
};
