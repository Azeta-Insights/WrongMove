import React from 'react';
import { ArrowLeft, Calendar, Sparkles, Check, Play } from 'lucide-react';
import { PlayerProgress } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface DailyChallengeModalProps {
  progress: PlayerProgress;
  onStartDailyChallenge: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  progress,
  onStartDailyChallenge,
  onClose,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = progress.dailyChallengeLastCompletedDate === todayStr;

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl overflow-hidden select-none text-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playTap();
            onClose();
          }}
          className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/40 px-3.5 py-1.5 rounded-full text-purple-200 font-bold text-xs uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>DAILY PUZZLE</span>
        </div>
      </div>

      {/* Hero Icon & Description */}
      <div className="my-auto flex flex-col items-center max-w-sm">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center text-5xl shadow-2xl mb-4 border-2 border-amber-200 animate-pulse">
          ⚡
        </div>

        <h2 className="text-3xl font-black mb-2 tracking-tight">TODAY'S CHALLENGE</h2>
        <p className="text-sm text-purple-200/90 font-medium mb-6">
          Complete today's physics surprise level to earn <span className="font-bold text-amber-300">+50 bonus coins</span>!
        </p>

        {isCompletedToday ? (
          <div className="w-full py-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 font-bold text-base flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>CHALLENGE COMPLETED TODAY!</span>
          </div>
        ) : (
          <button
            onClick={() => {
              soundEngine.playTap();
              onStartDailyChallenge();
            }}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-xl rounded-2xl shadow-xl shadow-purple-950/40 border-b-4 border-amber-600 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            START CHALLENGE
          </button>
        )}
      </div>

      <div className="text-xs text-purple-300/60 font-mono">
        Resets daily at midnight local time
      </div>
    </div>
  );
};
