import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Wrench, Trash2, AlertTriangle, Check } from 'lucide-react';
import { PlayerProgress } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface SettingsModalProps {
  progress: PlayerProgress;
  onToggleSound: () => void;
  onToggleDevMode: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onToggleSound,
  onToggleDevMode,
  onResetProgress,
  onClose,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-between bg-slate-900 text-white rounded-3xl p-6 shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            soundEngine.playTap();
            onClose();
          }}
          className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black uppercase tracking-wider text-amber-300">
          SETTINGS
        </h2>
        <div className="w-10" />
      </div>

      {/* Settings Options */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Sound FX Toggle */}
        <div className="p-4 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-300">
              {progress.soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-sm">Sound Effects</div>
              <div className="text-xs text-white/60">Audio feedback and SFX</div>
            </div>
          </div>

          <button
            onClick={() => {
              onToggleSound();
              soundEngine.playTap();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              !progress.soundMuted
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 text-white/50'
            }`}
          >
            {!progress.soundMuted ? 'ENABLED' : 'MUTED'}
          </button>
        </div>

        {/* Developer Test Mode Toggle */}
        <div className="p-4 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-300">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Developer Test Mode</div>
              <div className="text-xs text-white/60">Unlock all worlds & debug overlays</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              onToggleDevMode();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              progress.devMode
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-white/50'
            }`}
          >
            {progress.devMode ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        {/* Reset Progress Section */}
        <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/30 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-300">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-rose-200">Reset Game Data</div>
              <div className="text-xs text-rose-300/70">Wipe all progress for fresh testing</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              setShowResetConfirm(true);
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50">
          <div className="bg-slate-800 border-2 border-rose-500/50 p-6 rounded-3xl max-w-sm w-full flex flex-col items-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-400 mb-2 animate-bounce" />
            <h3 className="text-xl font-black text-white mb-2">ARE YOU SURE?</h3>
            <p className="text-xs text-white/80 mb-6">
              This will permanently reset all earned stars, coins, unlocked worlds, and secret solution discoveries!
            </p>

            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                CANCEL
              </button>

              <button
                onClick={() => {
                  soundEngine.playFail();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                YES, RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
