import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Lock, Coins } from 'lucide-react';
import { CharacterItem, EffectItem, PlayerProgress } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface CollectionScreenProps {
  progress: PlayerProgress;
  onSelectCharacter: (charId: string) => void;
  onSelectEffect: (effectId: string) => void;
  onUnlockCharacter: (charId: string, price: number) => void;
  onUnlockEffect: (effectId: string, price: number) => void;
  onClose: () => void;
}

const CHARACTERS: CharacterItem[] = [
  { id: 'Default', name: 'Default', price: 0, emoji: '🧍', description: 'Classic casual solver', bgColor: 'bg-blue-500' },
  { id: 'Chef', name: 'Chef', price: 100, emoji: '👨‍🍳', description: 'Master of kitchen chaos', bgColor: 'bg-rose-500' },
  { id: 'Beachgoer', name: 'Beachgoer', price: 150, emoji: '🏄', description: 'Rides the waves', bgColor: 'bg-amber-500' },
  { id: 'Astronaut', name: 'Astronaut', price: 200, emoji: '🧑‍🚀', description: 'Defies zero gravity', bgColor: 'bg-indigo-500' },
  { id: 'Ninja', name: 'Ninja', price: 300, emoji: '🥷', description: 'Silent secret agent', bgColor: 'bg-slate-800' },
];

const EFFECTS: EffectItem[] = [
  { id: 'Confetti', name: 'Confetti', price: 0, emoji: '🎉', description: 'Colorful victory shower', colors: ['#60a5fa', '#f472b6', '#34d399'] },
  { id: 'Spark', name: 'Spark', price: 50, emoji: '✨', description: 'Golden glittering sparkles', colors: ['#fef08a', '#eab308'] },
  { id: 'Explosion', name: 'Explosion', price: 100, emoji: '💥', description: 'Dramatic blast particle burst', colors: ['#ef4444', '#f97316'] },
  { id: 'Star burst', name: 'Star burst', price: 150, emoji: '⭐', description: 'Shooting stars effect', colors: ['#fbbf24', '#f59e0b'] },
  { id: 'Rainbow', name: 'Rainbow', price: 200, emoji: '🌈', description: 'Prismatic color wave', colors: ['#ef4444', '#eab308', '#22c55e', '#3b82f6'] },
];

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  progress,
  onSelectCharacter,
  onSelectEffect,
  onUnlockCharacter,
  onUnlockEffect,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'effects'>('characters');

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col bg-slate-900 text-white rounded-3xl p-5 shadow-2xl overflow-hidden select-none">
      {/* Header */}
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

        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-amber-300 font-bold text-sm">
          <span>🪙</span>
          <span>{progress.coins} Coins</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl mb-4 border border-white/10">
        <button
          onClick={() => {
            soundEngine.playTap();
            setActiveTab('characters');
          }}
          className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'characters'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>🧍</span>
          <span>Characters</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playTap();
            setActiveTab('effects');
          }}
          className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'effects'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Victory Effects</span>
        </button>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
        {activeTab === 'characters'
          ? CHARACTERS.map((char) => {
              const isUnlocked = progress.unlockedCharacters.includes(char.id) || char.price === 0;
              const isSelected = progress.selectedCharacter === char.id;

              return (
                <div
                  key={char.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg'
                      : 'bg-white/10 border-white/15 text-white/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${char.bgColor} flex items-center justify-center text-2xl shadow-md`}>
                      {char.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{char.name}</div>
                      <div className="text-xs text-white/60">{char.description}</div>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playTap();
                        onSelectCharacter(char.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white flex items-center gap-1'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : 'Equip'}
                    </button>
                  ) : (
                    <button
                      disabled={progress.coins < char.price}
                      onClick={() => {
                        soundEngine.playSuccess();
                        onUnlockCharacter(char.id, char.price);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        progress.coins >= char.price
                          ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 font-black'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{char.price}</span>
                    </button>
                  )}
                </div>
              );
            })
          : EFFECTS.map((eff) => {
              const isUnlocked = progress.unlockedEffects.includes(eff.id) || eff.price === 0;
              const isSelected = progress.selectedEffect === eff.id;

              return (
                <div
                  key={eff.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg'
                      : 'bg-white/10 border-white/15 text-white/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-2xl shadow-md">
                      {eff.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{eff.name}</div>
                      <div className="text-xs text-white/60">{eff.description}</div>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playTap();
                        onSelectEffect(eff.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white flex items-center gap-1'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : 'Equip'}
                    </button>
                  ) : (
                    <button
                      disabled={progress.coins < eff.price}
                      onClick={() => {
                        soundEngine.playSuccess();
                        onUnlockEffect(eff.id, eff.price);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        progress.coins >= eff.price
                          ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 font-black'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{eff.price}</span>
                    </button>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};
