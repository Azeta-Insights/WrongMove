import { GameObject, Particle } from '../types';
import { soundEngine } from '../audio/soundEngine';

export class PhysicsEngine {
  public objects: GameObject[] = [];
  public particles: Particle[] = [];
  public gravity: number = 980;
  public groundY: number = 750;
  public wallLeft: number = 20;
  public wallRight: number = 580;
  public windX: number = 0;
  public waterLineY?: number;

  public draggedObjectId: string | null = null;
  public dragOffsetX: number = 0;
  public dragOffsetY: number = 0;
  public dragTargetX: number = 0;
  public dragTargetY: number = 0;

  constructor() {}

  public init(
    objects: GameObject[],
    env: {
      gravity: number;
      groundY: number;
      wallLeft: number;
      wallRight: number;
      windX?: number;
      waterLineY?: number;
    }
  ) {
    // Deep clone objects
    this.objects = JSON.parse(JSON.stringify(objects));
    this.particles = [];
    this.gravity = env.gravity;
    this.groundY = env.groundY;
    this.wallLeft = env.wallLeft;
    this.wallRight = env.wallRight;
    this.windX = env.windX || 0;
    this.waterLineY = env.waterLineY;
    this.draggedObjectId = null;
  }

  public update(dt: number) {
    // Clamp delta time to prevent physics tunnel/explosion
    const clampedDt = Math.min(dt, 0.033);

    // Update dragged object position softly or directly
    if (this.draggedObjectId) {
      const dragged = this.objects.find((o) => o.id === this.draggedObjectId);
      if (dragged) {
        const targetX = this.dragTargetX - this.dragOffsetX;
        const targetY = this.dragTargetY - this.dragOffsetY;
        
        // Compute velocity from drag
        dragged.vx = (targetX - dragged.x) * 15;
        dragged.vy = (targetY - dragged.y) * 15;
        dragged.x = targetX;
        dragged.y = targetY;
      }
    }

    // Step physics for all objects
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      if (obj.isStatic || obj.id === this.draggedObjectId) {
        continue;
      }

      // Apply Gravity
      obj.vy += this.gravity * clampedDt;

      // Apply Wind if active
      if (this.windX) {
        obj.vx += this.windX * clampedDt;
      }

      // Apply Water Buoyancy
      if (this.waterLineY !== undefined && obj.y + obj.height / 2 > this.waterLineY) {
        // In water: upward force and drag
        const depth = Math.min(100, (obj.y + obj.height / 2) - this.waterLineY);
        const buoyancy = -this.gravity * 1.4 * (depth / 50);
        obj.vy += buoyancy * clampedDt;
        obj.vx *= 0.94; // water drag
        obj.vy *= 0.92;
      }

      // Air resistance / friction
      obj.vx *= 0.99;
      obj.vy *= 0.995;

      // Position update
      obj.x += obj.vx * clampedDt;
      obj.y += obj.vy * clampedDt;
      obj.rotation += obj.angularVelocity * clampedDt;
      obj.angularVelocity *= 0.98;

      // Ground Collision
      const halfH = obj.height / 2;
      const halfW = obj.width / 2;

      if (obj.y + halfH > this.groundY) {
        obj.y = this.groundY - halfH;
        if (Math.abs(obj.vy) > 30) {
          soundEngine.playBounce();
          this.createCollisionParticles(obj.x, obj.y + halfH, obj.color, 4);
        }
        obj.vy = -obj.vy * obj.restitution;
        obj.vx *= 1 - obj.friction;

        if (Math.abs(obj.vy) < 10) obj.vy = 0;
      }

      // Wall Left Collision
      if (obj.x - halfW < this.wallLeft) {
        obj.x = this.wallLeft + halfW;
        obj.vx = -obj.vx * obj.restitution;
      }

      // Wall Right Collision
      if (obj.x + halfW > this.wallRight) {
        obj.x = this.wallRight - halfW;
        obj.vx = -obj.vx * obj.restitution;
      }
    }

    // Object-to-Object Collisions
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const a = this.objects[i];
        const b = this.objects[j];

        this.checkAndResolveCollision(a, b);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * clampedDt;
      p.y += p.vy * clampedDt;
      p.alpha -= clampedDt / p.maxLife;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private checkAndResolveCollision(a: GameObject, b: GameObject) {
    if (a.isStatic && b.isStatic) return;

    // Simple AABB Box Collision
    const aHalfW = a.width / 2;
    const aHalfH = a.height / 2;
    const bHalfW = b.width / 2;
    const bHalfH = b.height / 2;

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const overlapX = aHalfW + bHalfW - Math.abs(dx);
    const overlapY = aHalfH + bHalfH - Math.abs(dy);

    if (overlapX > 0 && overlapY > 0) {
      // Collision detected!
      if (overlapX < overlapY) {
        // Resolve on X axis
        const sign = dx > 0 ? 1 : -1;
        if (!a.isStatic && a.id !== this.draggedObjectId) a.x -= (overlapX / 2) * sign;
        if (!b.isStatic && b.id !== this.draggedObjectId) b.x += (overlapX / 2) * sign;

        // Exchange X momentum
        const totalV = a.vx - b.vx;
        if (Math.abs(totalV) > 30) soundEngine.playBounce();
        const e = Math.min(a.restitution, b.restitution);
        if (!a.isStatic) a.vx -= totalV * (1 + e) * 0.5;
        if (!b.isStatic) b.vx += totalV * (1 + e) * 0.5;
      } else {
        // Resolve on Y axis
        const sign = dy > 0 ? 1 : -1;
        if (!a.isStatic && a.id !== this.draggedObjectId) a.y -= (overlapY / 2) * sign;
        if (!b.isStatic && b.id !== this.draggedObjectId) b.y += (overlapY / 2) * sign;

        // Exchange Y momentum
        const totalV = a.vy - b.vy;
        if (Math.abs(totalV) > 30) soundEngine.playBounce();
        const e = Math.min(a.restitution, b.restitution);
        if (!a.isStatic) a.vy -= totalV * (1 + e) * 0.5;
        if (!b.isStatic) b.vy += totalV * (1 + e) * 0.5;
      }
    }
  }

  public createCollisionParticles(x: number, y: number, color: string, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      this.particles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        color,
        size: 3 + Math.random() * 5,
        alpha: 1,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.4,
      });
    }
  }

  public createEffectBurst(x: number, y: number, effectType: string = 'Confetti') {
    const colors =
      effectType === 'Rainbow'
        ? ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']
        : effectType === 'Spark'
        ? ['#fef08a', '#fde047', '#eab308', '#ffffff']
        : effectType === 'Explosion'
        ? ['#ef4444', '#f97316', '#fef08a', '#18181b']
        : ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa']; // Confetti / Star burst default

    const particleCount = effectType === 'Explosion' ? 35 : 25;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 300;
      this.particles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 7,
        alpha: 1,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.6,
        shape: effectType === 'Star burst' ? 'star' : 'circle',
      });
    }
  }

  public getObjectAt(x: number, y: number): GameObject | null {
    // Reverse order so top objects are selected first
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      if (!obj.isInteractive) continue;

      const halfW = obj.width / 2;
      const halfH = obj.height / 2;

      if (
        x >= obj.x - halfW - 10 &&
        x <= obj.x + halfW + 10 &&
        y >= obj.y - halfH - 10 &&
        y <= obj.y + halfH + 10
      ) {
        return obj;
      }
    }
    return null;
  }
}
