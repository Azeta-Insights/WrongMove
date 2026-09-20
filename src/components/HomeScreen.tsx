import React from 'react';
import { Play, Sparkles, Calendar, Settings, Grid, Volume2, VolumeX } from 'lucide-react';
import { PlayerProgress } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface HomeScreenProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onOpenLevelSelect: () => void;
  onOpenCollection: () => void;
  onOpenDailyChallenge: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onPlay,
  onOpenLevelSelect,
  onOpenCollection,
  onOpenDailyChallenge,
  onOpenSettings,
}) => {
  // Calculate total stars earned
  const totalStars = Object.values(progress.starsByLevel).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-between items-center p-6 bg-gradient-to-b from-amber-400 via-orange-500 to-rose-600 text-white rounded-3xl shadow-2xl overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-lg">{totalStars}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            <span className="text-xl">🪙</span>
            <span className="font-bold text-lg">{progress.coins}</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playTap();
            onOpenSettings();
          }}
          className="p-3 bg-black/25 hover:bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white transition-transform active:scale-95"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Branding */}
      <div className="flex flex-col items-center text-center my-auto z-10">
        <div className="inline-block mb-3 px-4 py-1.5 bg-amber-300/30 backdrop-blur-md rounded-full border border-amber-200/40 text-amber-100 font-semibold text-xs tracking-widest uppercase">
          Physics Puzzle Prototype
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight drop-shadow-md text-amber-100 uppercase">
          WRONG MOVE
        </h1>
        <p className="mt-2 text-lg sm:text-xl font-medium text-amber-100/90 italic drop-shadow">
          Every move changes everything.
        </p>
      </div>

      {/* Dominant Controls */}
      <div className="w-full max-w-xs flex flex-col gap-3.5 z-10 mb-4">
        {/* Dominant PLAY Button */}
        <button
          onClick={() => {
            soundEngine.playTap();
            onPlay();
          }}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-2xl tracking-wide rounded-2xl shadow-xl shadow-emerald-950/30 flex items-center justify-center gap-3 border-b-4 border-emerald-700 transition-all cursor-pointer"
        >
          <Play className="w-8 h-8 fill-current" />
          PLAY
        </button>

        {/* Level Select & Daily Challenge */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundEngine.playTap();
              onOpenLevelSelect();
            }}
            className="py-3 px-4 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-sm rounded-xl backdrop-blur-md border border-white/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            LEVELS
          </button>

          <button
            onClick={() => {
              soundEngine.playTap();
              onOpenDailyChallenge();
            }}
            className="py-3 px-4 bg-amber-400/30 hover:bg-amber-400/40 active:scale-95 text-amber-100 font-bold text-sm rounded-xl backdrop-blur-md border border-amber-300/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            DAILY
          </button>
        </div>

        {/* Collection Button */}
        <button
          onClick={() => {
            soundEngine.playTap();
            onOpenCollection();
          }}
          className="w-full py-3 bg-purple-600/40 hover:bg-purple-600/50 active:scale-95 text-purple-100 font-bold text-sm rounded-xl backdrop-blur-md border border-purple-300/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          COLLECTION
        </button>
      </div>
    </div>
  );
};
