import React, { useRef, useEffect, useCallback } from 'react';
import { PhysicsEngine } from '../game/physicsEngine';
import { GameObject, LevelDefinition, LevelStats } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface GameCanvasProps {
  level: LevelDefinition;
  physics: PhysicsEngine;
  stats: LevelStats;
  selectedCharacterEmoji: string;
  selectedEffectName: string;
  devMode: boolean;
  onUpdateStats: (updater: (prev: LevelStats) => LevelStats) => void;
  onLevelComplete: (secretFound: boolean) => void;
  onLevelFailed: (reason: string) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  physics,
  stats,
  selectedCharacterEmoji,
  selectedEffectName,
  devMode,
  onUpdateStats,
  onLevelComplete,
  onLevelFailed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Resize canvas to container dimensions smoothly
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Convert client viewport X,Y to 600x700 virtual game coordinate space
  const getGameCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 700 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Pointer event handlers (Touch & Mouse)
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (stats.isComplete || stats.isFailed) return;

    const { x, y } = getGameCoords(clientX, clientY);
    touchStartPosRef.current = { x, y, time: performance.now() };

    const hit = physics.getObjectAt(x, y);
    if (hit) {
      onUpdateStats((prev) => ({
        ...prev,
        interactionsCount: prev.interactionsCount + 1,
      }));

      // Tap handling
      if (hit.interactionType === 'tap' || hit.interactionType === 'drag') {
        soundEngine.playTap();
        if (!hit.state) hit.state = {};
        hit.state.tapped = true;
        hit.state.tapCount = (hit.state.tapCount || 0) + 1;

        if (hit.interactionType === 'drag') {
          physics.draggedObjectId = hit.id;
          physics.dragOffsetX = x - hit.x;
          physics.dragOffsetY = y - hit.y;
          physics.dragTargetX = x;
          physics.dragTargetY = y;
          soundEngine.playDrag();
        }
      }
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (physics.draggedObjectId) {
      const { x, y } = getGameCoords(clientX, clientY);
      physics.dragTargetX = x;
      physics.dragTargetY = y;
    }
  };

  const handlePointerUp = (clientX: number, clientY: number) => {
    if (physics.draggedObjectId) {
      physics.draggedObjectId = null;
    }

    if (touchStartPosRef.current) {
      const { x: startX, y: startY, time: startTime } = touchStartPosRef.current;
      const { x: endX, y: endY } = getGameCoords(clientX, clientY);
      const dt = (performance.now() - startTime) / 1000;
      const dx = endX - startX;
      const dy = endY - startY;
      const dist = Math.hypot(dx, dy);

      // Swipe gesture trigger
      if (dist > 40 && dt < 0.4) {
        const hit = physics.getObjectAt(startX, startY);
        if (hit && hit.interactionType === 'swipe') {
          soundEngine.playBounce();
          if (!hit.state) hit.state = {};
          hit.state.swiped = true;
          hit.vx = (dx / dt) * 0.5;
          hit.vy = (dy / dt) * 0.5;
        }
      }
    }

    touchStartPosRef.current = null;
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const render = (now: number) => {
      if (!isSubscribed) return;

      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!stats.isComplete && !stats.isFailed) {
        physics.update(dt);

        onUpdateStats((prev) => {
          const newTime = prev.timeElapsed + dt;
          return { ...prev, timeElapsed: newTime };
        });

        // Check level completion/failure rules
        const cond = level.checkConditions(physics.objects, stats, dt);
        if (cond.isComplete && !stats.isComplete) {
          soundEngine.playSuccess();
          if (cond.isSecret) soundEngine.playSecretFound();
          physics.createEffectBurst(300, 350, selectedEffectName);
          onLevelComplete(cond.isSecret);
        } else if (cond.isFailed && !stats.isFailed) {
          soundEngine.playFail();
          onLevelFailed(cond.failReason || 'Wrong Move!');
        }
      }

      // Draw Viewport Canvas
      const container = containerRef.current;
      const displayW = container?.clientWidth || 600;
      const displayH = container?.clientHeight || 700;

      ctx.clearRect(0, 0, displayW, displayH);

      ctx.save();
      ctx.scale(displayW / 600, displayH / 700);

      // 1. World Environmental Background
      drawWorldBackground(ctx, level.worldId);

      // 2. Render Game Objects
      const timeSec = now / 1000;
      physics.objects.forEach((obj) => {
        drawGameObject(ctx, obj, selectedCharacterEmoji, timeSec);
      });

      // 3. Render Particle Bursts
      physics.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, 5, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 4. Developer / Test Mode Hitbox & Velocity Vectors Overlay
      if (devMode) {
        drawDevOverlay(ctx, physics);
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isSubscribed = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [level, physics, stats, selectedCharacterEmoji, selectedEffectName, devMode, onLevelComplete, onLevelFailed, onUpdateStats]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] max-h-[750px] flex items-center justify-center overflow-hidden rounded-2xl bg-amber-50 shadow-inner select-none touch-none"
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={(e) => handlePointerUp(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={(e) => {
        if (e.changedTouches.length > 0) {
          handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />
    </div>
  );
};

// Background Painter per World
function drawWorldBackground(ctx: CanvasRenderingContext2D, worldId: number) {
  if (worldId === 1) {
    // HOME: Wall wallpaper with soft floor carpet
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, 600, 620);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 620, 600, 80);

    // Subtle wall stripes
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.08)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 600; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 620);
      ctx.stroke();
    }
  } else if (worldId === 2) {
    // RESTAURANT: Cozy checkered flooring
    ctx.fillStyle = '#ffe4e6';
    ctx.fillRect(0, 0, 600, 620);
    ctx.fillStyle = '#be123c';
    ctx.fillRect(0, 620, 600, 80);

    // Checkered floor
    const tileSize = 40;
    for (let x = 0; x < 600; x += tileSize) {
      for (let y = 620; y < 700; y += tileSize) {
        if (((x / tileSize) + (y / tileSize)) % 2 === 0) {
          ctx.fillStyle = '#9f1239';
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }
  } else if (worldId === 3) {
    // BEACH: Sky, ocean wave & golden sand
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(0, 0, 600, 520);
    // Ocean
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 520, 600, 80);
    // Sand shore
    ctx.fillStyle = '#fde047';
    ctx.fillRect(0, 600, 600, 100);
  } else {
    // CHAOS: Neon cosmic grid
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 600, 700);

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 600; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 700);
      ctx.stroke();
    }
    for (let y = 0; y < 700; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }
  }
}

// GameObject Painter
function drawGameObject(
  ctx: CanvasRenderingContext2D,
  obj: GameObject,
  selectedCharacterEmoji: string,
  timeSec: number
) {
  ctx.save();
  ctx.translate(obj.x, obj.y);
  ctx.rotate(obj.rotation);

  const halfW = obj.width / 2;
  const halfH = obj.height / 2;

  // Soft Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.beginPath();
  ctx.ellipse(0, halfH + 4, halfW * 0.9, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Interactive Object Glow Affordance
  if (obj.isInteractive) {
    const pulse = Math.sin(timeSec * 5) * 3 + 4;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = pulse;
    ctx.beginPath();
    ctx.roundRect(-halfW - 2, -halfH - 2, obj.width + 4, obj.height + 4, 12);
    ctx.stroke();
  }

  // Base Shape Rendering
  ctx.fillStyle = obj.color;
  ctx.beginPath();
  ctx.roundRect(-halfW, -halfH, obj.width, obj.height, 12);
  ctx.fill();

  // Subtle highlight accent top-border
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.roundRect(-halfW, -halfH, obj.width, Math.max(8, obj.height * 0.2), [12, 12, 0, 0]);
  ctx.fill();

  // Emoji / Icon Overlay
  const displayEmoji =
    obj.tags?.includes('character') ? selectedCharacterEmoji : obj.emoji || '📦';

  ctx.font = `${Math.min(obj.width, obj.height) * 0.7}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayEmoji, 0, 0);

  ctx.restore();
}

// Draw Dev / Test Mode Hitboxes
function drawDevOverlay(ctx: CanvasRenderingContext2D, physics: PhysicsEngine) {
  physics.objects.forEach((obj) => {
    ctx.save();
    ctx.strokeStyle = obj.isInteractive ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(`${obj.name} (${obj.interactionType})`, obj.x - obj.width / 2, obj.y - obj.height / 2 - 4);
    ctx.restore();
  });
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
