import React, { useState } from 'react';
import { ArrowLeft, Lock, Star, Sparkles } from 'lucide-react';
import { WORLDS, LEVELS } from '../game/levelData';
import { PlayerProgress, WorldId } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface LevelSelectModalProps {
  progress: PlayerProgress;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  progress,
  onSelectLevel,
  onClose,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId>(1);

  const totalStars = Object.values(progress.starsByLevel).reduce((a, b) => a + b, 0);

  const currentWorld = WORLDS.find((w) => w.id === selectedWorldId) || WORLDS[0];

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col bg-slate-900 text-white rounded-3xl p-5 shadow-2xl overflow-hidden select-none">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundEngine.playTap();
            onClose();
          }}
          className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-amber-300 font-bold text-sm">
            <span>⭐</span>
            <span>{totalStars} Stars</span>
          </div>
        </div>
      </div>

      {/* World Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 rounded-2xl mb-4 border border-white/10">
        {WORLDS.map((world) => {
          const isUnlocked = progress.devMode || totalStars >= world.minStarsRequired;
          const isActive = world.id === selectedWorldId;

          return (
            <button
              key={world.id}
              onClick={() => {
                soundEngine.playTap();
                if (isUnlocked) setSelectedWorldId(world.id);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-amber-950 font-black shadow-lg scale-105'
                  : isUnlocked
                  ? 'text-white/80 hover:bg-white/10'
                  : 'text-white/30 cursor-not-allowed'
              }`}
            >
              <span className="text-base">{world.icon}</span>
              <span className="truncate w-full text-center">{world.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected World Banner */}
      <div
        className={`p-4 rounded-2xl mb-4 bg-gradient-to-r ${currentWorld.themeColor} shadow-lg border border-white/20`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">{currentWorld.title}</h2>
            <p className="text-xs text-white/90 font-medium">{currentWorld.subtitle}</p>
          </div>
          {totalStars < currentWorld.minStarsRequired && !progress.devMode && (
            <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full text-amber-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Requires {currentWorld.minStarsRequired} ⭐</span>
            </div>
          )}
        </div>
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
        {currentWorld.levelIds.map((levelId) => {
          const levelDef = LEVELS.find((l) => l.id === levelId);
          if (!levelDef) return null;

          const starsEarned = progress.starsByLevel[levelId] || 0;
          const secretFound = progress.secretDiscoveredByLevel[levelId] || false;
          const isWorldUnlocked =
            progress.devMode || totalStars >= currentWorld.minStarsRequired;

          return (
            <button
              key={levelId}
              disabled={!isWorldUnlocked}
              onClick={() => {
                soundEngine.playTap();
                onSelectLevel(levelId);
              }}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isWorldUnlocked
                  ? 'bg-white/10 hover:bg-white/20 active:scale-98 border-white/20 text-white shadow-md'
                  : 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center font-black text-amber-300 text-lg">
                  {levelId}
                </div>
                <div>
                  <div className="text-sm font-bold truncate max-w-[130px] sm:max-w-[160px]">
                    {levelDef.title}
                  </div>
                  <div className="text-[10px] text-white/60 line-clamp-1">
                    {levelDef.objective}
                  </div>
                </div>
              </div>

              {/* Stars & Secret Badge */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= starsEarned ? 'fill-amber-400 text-amber-400' : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                {secretFound && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Secret</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
