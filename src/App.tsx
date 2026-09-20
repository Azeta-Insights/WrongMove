import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerProgress, LevelStats, GameObject } from './types';
import { LEVELS, WORLDS } from './game/levelData';
import { PhysicsEngine } from './game/physicsEngine';
import { soundEngine } from './audio/soundEngine';

import { HomeScreen } from './components/HomeScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameOverlay } from './components/GameOverlay';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CollectionScreen } from './components/CollectionScreen';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SettingsModal } from './components/SettingsModal';
import { DevOverlay } from './components/DevOverlay';

const STORAGE_KEY = 'WRONG_MOVE_PLAYER_PROGRESS_V1';

const DEFAULT_PROGRESS: PlayerProgress = {
  currentLevelId: 1,
  unlockedWorlds: [1],
  starsByLevel: {},
  secretDiscoveredByLevel: {},
  coins: 0,
  unlockedCharacters: ['Default'],
  selectedCharacter: 'Default',
  unlockedEffects: ['Confetti'],
  selectedEffect: 'Confetti',
  soundMuted: false,
  devMode: false,
};

export default function App() {
  // Load progress from LocalStorage
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse localStorage:', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    soundEngine.setMuted(progress.soundMuted);
  }, [progress]);

  // Current UI Screen
  const [screen, setScreen] = useState<
    'home' | 'game' | 'levels' | 'collection' | 'daily' | 'settings'
  >('home');

  // Active Level
  const [currentLevelId, setCurrentLevelId] = useState<number>(progress.currentLevelId || 1);

  // Physics Engine Instance
  const physicsRef = useRef<PhysicsEngine>(new PhysicsEngine());

  // Current Level Stats State
  const [stats, setStats] = useState<LevelStats>({
    interactionsCount: 0,
    timeElapsed: 0,
    secretFound: false,
    primaryFound: false,
    isComplete: false,
    isFailed: false,
  });

  // Initialize level physics world
  const loadLevel = useCallback((levelId: number) => {
    const levelDef = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    const initialObjects = levelDef.createObjects();
    physicsRef.current.init(initialObjects, levelDef.environment);

    setStats({
      interactionsCount: 0,
      timeElapsed: 0,
      secretFound: false,
      primaryFound: false,
      isComplete: false,
      isFailed: false,
    });
  }, []);

  // Handle Play Level
  const handleStartLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    loadLevel(levelId);
    setScreen('game');
  };

  // Level Completion Logic
  const handleLevelComplete = (secretFound: boolean) => {
    const levelDef = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

    // Compute earned stars
    let earnedStars = 1;
    if (secretFound) {
      earnedStars = 3;
    } else if (
      levelDef.maxInteractionsFor2Stars &&
      stats.interactionsCount <= levelDef.maxInteractionsFor2Stars
    ) {
      earnedStars = 2;
    }

    setStats((prev) => ({
      ...prev,
      isComplete: true,
      secretFound: secretFound || prev.secretFound,
    }));

    // Update Progress
    setProgress((prev) => {
      const prevStars = prev.starsByLevel[currentLevelId] || 0;
      const newStars = Math.max(prevStars, earnedStars);

      const secretDiscovered = secretFound || prev.secretDiscoveredByLevel[currentLevelId] || false;

      // Coins calculation
      let bonusCoins = 10; // base completion
      if (secretFound && !prev.secretDiscoveredByLevel[currentLevelId]) bonusCoins += 25;
      if (earnedStars === 3) bonusCoins += 15;

      const newStarsByLevel = { ...prev.starsByLevel, [currentLevelId]: newStars };
      const totalStars = Object.values(newStarsByLevel).reduce((a, b) => a + b, 0);

      // World Unlocking Check
      const unlockedWorlds = [...prev.unlockedWorlds];
      WORLDS.forEach((world) => {
        if (totalStars >= world.minStarsRequired && !unlockedWorlds.includes(world.id)) {
          unlockedWorlds.push(world.id);
        }
      });

      return {
        ...prev,
        currentLevelId,
        starsByLevel: newStarsByLevel,
        secretDiscoveredByLevel: {
          ...prev.secretDiscoveredByLevel,
          [currentLevelId]: secretDiscovered,
        },
        coins: prev.coins + bonusCoins,
        unlockedWorlds,
      };
    });
  };

  // Level Failure Logic
  const handleLevelFailed = (reason: string) => {
    setStats((prev) => ({
      ...prev,
      isFailed: true,
      failReason: reason,
    }));
  };

  // Reset Level
  const handleResetLevel = () => {
    loadLevel(currentLevelId);
  };

  // Next Level
  const handleNextLevel = () => {
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      handleStartLevel(nextId);
    } else {
      setScreen('levels');
    }
  };

  // Developer Mode Auto-Win Primary
  const handleDevAutoWinPrimary = () => {
    handleLevelComplete(false);
  };

  // Developer Mode Auto-Win Secret
  const handleDevAutoWinSecret = () => {
    handleLevelComplete(true);
  };

  // Developer Mode Unlock All Worlds
  const handleDevUnlockAll = () => {
    setProgress((prev) => ({
      ...prev,
      devMode: true,
      unlockedWorlds: [1, 2, 3, 4],
    }));
  };

  // Reset Game Progress
  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
    setScreen('home');
  };

  const currentLevelDef = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];
  const currentWorld = WORLDS.find((w) => w.id === currentLevelDef.worldId) || WORLDS[0];
  const currentStars = progress.starsByLevel[currentLevelId] || 0;

  // Selected Character Emoji mapping
  const characterEmojiMap: Record<string, string> = {
    Default: '🧍',
    Chef: '👨‍🍳',
    Beachgoer: '🏄',
    Astronaut: '🧑‍🚀',
    Ninja: '🥷',
  };

  return (
    <div className="w-full h-screen max-w-md mx-auto flex flex-col justify-center items-center p-2 sm:p-4 bg-slate-950 font-sans select-none overflow-hidden">
      <div className="relative w-full h-full max-h-[750px] aspect-[6/7] rounded-3xl shadow-2xl overflow-hidden bg-slate-900 border border-slate-800">
        {screen === 'home' && (
          <HomeScreen
            progress={progress}
            onPlay={() => handleStartLevel(progress.currentLevelId || 1)}
            onOpenLevelSelect={() => setScreen('levels')}
            onOpenCollection={() => setScreen('collection')}
            onOpenDailyChallenge={() => setScreen('daily')}
            onOpenSettings={() => setScreen('settings')}
          />
        )}

        {screen === 'game' && (
          <div className="relative w-full h-full">
            <GameCanvas
              level={currentLevelDef}
              physics={physicsRef.current}
              stats={stats}
              selectedCharacterEmoji={characterEmojiMap[progress.selectedCharacter] || '🧍'}
              selectedEffectName={progress.selectedEffect}
              devMode={progress.devMode}
              onUpdateStats={setStats}
              onLevelComplete={handleLevelComplete}
              onLevelFailed={handleLevelFailed}
            />

            <GameOverlay
              level={currentLevelDef}
              worldName={currentWorld.name}
              stats={stats}
              currentStars={currentStars}
              onResetLevel={handleResetLevel}
              onNextLevel={handleNextLevel}
              onReturnHome={() => setScreen('home')}
            />
          </div>
        )}

        {screen === 'levels' && (
          <LevelSelectModal
            progress={progress}
            onSelectLevel={handleStartLevel}
            onClose={() => setScreen('home')}
          />
        )}

        {screen === 'collection' && (
          <CollectionScreen
            progress={progress}
            onSelectCharacter={(charId) =>
              setProgress((prev) => ({ ...prev, selectedCharacter: charId }))
            }
            onSelectEffect={(effectId) =>
              setProgress((prev) => ({ ...prev, selectedEffect: effectId }))
            }
            onUnlockCharacter={(charId, price) =>
              setProgress((prev) => ({
                ...prev,
                coins: prev.coins - price,
                unlockedCharacters: [...prev.unlockedCharacters, charId],
                selectedCharacter: charId,
              }))
            }
            onUnlockEffect={(effectId, price) =>
              setProgress((prev) => ({
                ...prev,
                coins: prev.coins - price,
                unlockedEffects: [...prev.unlockedEffects, effectId],
                selectedEffect: effectId,
              }))
            }
            onClose={() => setScreen('home')}
          />
        )}

        {screen === 'daily' && (
          <DailyChallengeModal
            progress={progress}
            onStartDailyChallenge={() => {
              // Special random daily level
              const dailyLevelId = (new Date().getDate() % 20) + 1;
              handleStartLevel(dailyLevelId);
            }}
            onClose={() => setScreen('home')}
          />
        )}

        {screen === 'settings' && (
          <SettingsModal
            progress={progress}
            onToggleSound={() =>
              setProgress((prev) => ({ ...prev, soundMuted: !prev.soundMuted }))
            }
            onToggleDevMode={() =>
              setProgress((prev) => ({ ...prev, devMode: !prev.devMode }))
            }
            onResetProgress={handleResetProgress}
            onClose={() => setScreen('home')}
          />
        )}

        {/* Floating Developer Mode Toolbar Overlay */}
        {progress.devMode && (
          <DevOverlay
            onUnlockAll={handleDevUnlockAll}
            onSkipLevel={handleNextLevel}
            onAutoWinPrimary={handleDevAutoWinPrimary}
            onAutoWinSecret={handleDevAutoWinSecret}
            onResetLevel={handleResetLevel}
          />
        )}
      </div>
    </div>
  );
}
