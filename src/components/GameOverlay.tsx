import React from 'react';
import { RotateCcw, Home, Star, Sparkles, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { LevelDefinition, LevelStats } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface GameOverlayProps {
  level: LevelDefinition;
  worldName: string;
  stats: LevelStats;
  currentStars: number;
  onResetLevel: () => void;
  onNextLevel: () => void;
  onReturnHome: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  level,
  worldName,
  stats,
  currentStars,
  onResetLevel,
  onNextLevel,
  onReturnHome,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playTap();
              onReturnHome();
            }}
            className="p-2 hover:bg-white/20 active:scale-95 rounded-xl transition-all cursor-pointer"
            title="Home Menu"
          >
            <Home className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
              {worldName} • LEVEL {level.id}
            </div>
            <div className="text-xs font-bold truncate max-w-[140px] sm:max-w-[200px]">
              {level.title}
            </div>
          </div>
        </div>

        {/* Stars Indicator */}
        <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-4 h-4 ${
                starIdx <= currentStars
                  ? 'fill-amber-400 text-amber-400 drop-shadow'
                  : 'text-white/30'
              }`}
            />
          ))}
        </div>

        {/* Restart Button */}
        <button
          onClick={() => {
            soundEngine.playTap();
            onResetLevel();
          }}
          className="p-2 hover:bg-white/20 active:scale-95 rounded-xl transition-all cursor-pointer text-amber-300"
          title="Restart Level"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Level Objective Banner */}
      {!stats.isComplete && !stats.isFailed && (
        <div className="self-center bg-black/60 backdrop-blur-md text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full border border-white/20 shadow-lg text-center mt-2 animate-bounce">
          🎯 {level.objective}
        </div>
      )}

      {/* Completion Modal Popup */}
      {stats.isComplete && (
        <div className="pointer-events-auto absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in zoom-in duration-200">
          <div className="bg-gradient-to-b from-amber-400 to-orange-500 rounded-3xl p-6 text-white max-w-sm w-full shadow-2xl border-2 border-amber-200 flex flex-col items-center">
            <div className="text-sm font-black text-amber-100 tracking-widest uppercase mb-1">
              LEVEL {level.id} COMPLETE
            </div>
            <h2 className="text-3xl font-black mb-4 drop-shadow">EXCELLENT!</h2>

            {/* Stars Awarded */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((starIdx) => (
                <div
                  key={starIdx}
                  className={`p-3 rounded-full ${
                    starIdx <= (stats.secretFound ? 3 : stats.interactionsCount <= 2 ? 2 : 1)
                      ? 'bg-amber-300 text-amber-900 scale-110 shadow-lg'
                      : 'bg-black/20 text-white/30'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </div>
              ))}
            </div>

            {/* Secret Solution Badge Hint */}
            {!stats.secretFound ? (
              <div className="w-full bg-black/25 backdrop-blur-md p-3 rounded-xl border border-white/20 mb-5 text-amber-100 text-xs font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>SECRET SOLUTION NOT FOUND! Try again to discover it!</span>
              </div>
            ) : (
              <div className="w-full bg-purple-900/40 backdrop-blur-md p-3 rounded-xl border border-purple-300/40 mb-5 text-purple-100 text-xs font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-300 shrink-0" />
                <span>SECRET SOLUTION DISCOVERED! (+25 COINS)</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  onResetLevel();
                }}
                className="py-3 px-4 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/30"
              >
                <RefreshCw className="w-4 h-4" />
                TRY AGAIN
              </button>

              <button
                onClick={() => {
                  soundEngine.playTap();
                  onNextLevel();
                }}
                className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/30 border-b-4 border-emerald-700 transition-all"
              >
                NEXT
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Failure Modal Popup */}
      {stats.isFailed && (
        <div className="pointer-events-auto absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in zoom-in duration-200">
          <div className="bg-gradient-to-b from-rose-500 to-red-600 rounded-3xl p-6 text-white max-w-sm w-full shadow-2xl border-2 border-rose-300 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-rose-200 mb-2 animate-bounce" />
            <h2 className="text-3xl font-black mb-1 uppercase tracking-wider drop-shadow">
              WRONG MOVE
            </h2>
            <p className="text-sm text-rose-100/90 font-medium mb-6">
              {stats.failReason || 'An unexpected consequence occurred!'}
            </p>

            <button
              onClick={() => {
                soundEngine.playTap();
                onResetLevel();
              }}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-lg rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-rose-950/40 border-b-4 border-amber-600 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
