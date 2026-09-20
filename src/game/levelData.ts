import { GameObject, LevelDefinition, WorldDefinition, LevelStats } from '../types';

export const WORLDS: WorldDefinition[] = [
  {
    id: 1,
    name: 'HOME',
    title: 'World 1: Cozy Home',
    subtitle: 'Learn basic physics, tap, and drag interactions.',
    minStarsRequired: 0,
    levelIds: [1, 2, 3, 4, 5],
    themeColor: 'from-amber-500 to-orange-600',
    bgColor: '#fef3c7',
    bgGradient: 'bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200',
    icon: '🏠',
  },
  {
    id: 2,
    name: 'RESTAURANT',
    title: 'World 2: Busy Restaurant',
    subtitle: 'Master timing, falling plates, and waiter chain reactions.',
    minStarsRequired: 8,
    levelIds: [6, 7, 8, 9, 10],
    themeColor: 'from-red-500 to-rose-600',
    bgColor: '#ffe4e6',
    bgGradient: 'bg-gradient-to-b from-rose-100 via-red-50 to-rose-200',
    icon: '🍕',
  },
  {
    id: 3,
    name: 'BEACH',
    title: 'World 3: Sunny Beach',
    subtitle: 'Experiment with rolling balls, wind, water buoyancy, and bouncing.',
    minStarsRequired: 20,
    levelIds: [11, 12, 13, 14, 15],
    themeColor: 'from-cyan-500 to-blue-600',
    bgColor: '#e0f2fe',
    bgGradient: 'bg-gradient-to-b from-sky-100 via-cyan-50 to-blue-200',
    icon: '🏖️',
  },
  {
    id: 4,
    name: 'CHAOS',
    title: 'World 4: Pure Chaos',
    subtitle: 'Unleash wild chain reactions, fast timers, and surprising secrets.',
    minStarsRequired: 35,
    levelIds: [16, 17, 18, 19, 20],
    themeColor: 'from-purple-600 to-indigo-700',
    bgColor: '#f3e8ff',
    bgGradient: 'bg-gradient-to-b from-purple-100 via-indigo-50 to-purple-200',
    icon: '⚡',
  },
];

export const LEVELS: LevelDefinition[] = [
  // LEVEL 1
  {
    id: 1,
    worldId: 1,
    title: 'GET THE CAKE',
    objective: 'Get the cake to the character!',
    hint: 'Drag the chair closer to reach the cake, or look above!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'char',
        name: 'Player Character',
        x: 120,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🧍',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
        tags: ['character'],
      },
      {
        id: 'table',
        name: 'Table',
        x: 380,
        y: 530,
        vx: 0,
        vy: 0,
        width: 140,
        height: 80,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#92400e',
        emoji: '🪑',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'cake',
        name: 'Cake',
        x: 380,
        y: 460,
        vx: 0,
        vy: 0,
        width: 50,
        height: 40,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#f43f5e',
        emoji: '🎂',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.3,
        friction: 0.5,
        tags: ['cake', 'target'],
      },
      {
        id: 'chair',
        name: 'Chair',
        x: 480,
        y: 540,
        vx: 0,
        vy: 0,
        width: 50,
        height: 70,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#b45309',
        emoji: '🪑',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.8,
        tags: ['chair'],
      },
      {
        id: 'vase',
        name: 'Hanging Vase',
        x: 380,
        y: 180,
        vx: 0,
        vy: 0,
        width: 45,
        height: 45,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#06b6d4',
        emoji: '🏺',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.4,
        friction: 0.5,
        tags: ['secret_trigger'],
      },
    ],
    checkConditions: (objects, stats) => {
      const cake = objects.find((o) => o.id === 'cake');
      const char = objects.find((o) => o.id === 'char');
      const vase = objects.find((o) => o.id === 'vase');

      let isSecret = false;
      let isComplete = false;
      let isFailed = false;

      if (cake && char) {
        const dx = Math.abs(cake.x - char.x);
        const dy = Math.abs(cake.y - char.y);

        if (dx < 70 && dy < 80) {
          isComplete = true;
          if (vase && vase.state?.tapped) {
            isSecret = true;
          }
        }
      }

      return { isComplete, isFailed, isSecret };
    },
  },

  // LEVEL 2
  {
    id: 2,
    worldId: 1,
    title: 'GET THE BALL',
    objective: 'Get the ball off the high shelf!',
    hint: 'Drag the chair under the shelf or tap the sleeping cat!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'char',
        name: 'Character',
        x: 100,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🧍',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
      {
        id: 'shelf',
        name: 'High Shelf',
        x: 450,
        y: 280,
        vx: 0,
        vy: 0,
        width: 160,
        height: 20,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#78350f',
        emoji: '📦',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'ball',
        name: 'Ball',
        x: 450,
        y: 230,
        vx: 0,
        vy: 0,
        width: 45,
        height: 45,
        radius: 22,
        shape: 'circle',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#ef4444',
        emoji: '⚽',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.7,
        friction: 0.3,
        tags: ['ball', 'target'],
      },
      {
        id: 'chair',
        name: 'Chair',
        x: 240,
        y: 540,
        vx: 0,
        vy: 0,
        width: 50,
        height: 70,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#b45309',
        emoji: '🪑',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.8,
      },
      {
        id: 'cat',
        name: 'Sleeping Cat',
        x: 400,
        y: 240,
        vx: 0,
        vy: 0,
        width: 40,
        height: 35,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#f97316',
        emoji: '🐱',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.8,
        tags: ['cat', 'secret_trigger'],
      },
    ],
    checkConditions: (objects) => {
      const ball = objects.find((o) => o.id === 'ball');
      const char = objects.find((o) => o.id === 'char');
      const cat = objects.find((o) => o.id === 'cat');

      let isComplete = false;
      let isSecret = false;

      if (ball && char) {
        if (Math.abs(ball.x - char.x) < 80 && Math.abs(ball.y - char.y) < 100) {
          isComplete = true;
          if (cat && cat.state?.tapped) {
            isSecret = true;
          }
        }
      }
      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 3
  {
    id: 3,
    worldId: 1,
    title: 'FEED THE CAT',
    objective: 'Feed the hungry cat!',
    hint: 'Drag the fish into the bowl, or tap the cat to jump!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'cat',
        name: 'Cat',
        x: 120,
        y: 540,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'tap',
        color: '#f97316',
        emoji: '🐱',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.3,
        friction: 0.8,
        tags: ['cat'],
      },
      {
        id: 'bowl',
        name: 'Food Bowl',
        x: 200,
        y: 560,
        vx: 0,
        vy: 0,
        width: 50,
        height: 30,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#06b6d4',
        emoji: '🥣',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'table',
        name: 'Counter Table',
        x: 440,
        y: 480,
        vx: 0,
        vy: 0,
        width: 140,
        height: 120,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#92400e',
        emoji: '🪵',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'fish',
        name: 'Tasty Fish',
        x: 440,
        y: 400,
        vx: 0,
        vy: 0,
        width: 45,
        height: 35,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#3b82f6',
        emoji: '🐟',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.5,
        tags: ['fish', 'target'],
      },
    ],
    checkConditions: (objects) => {
      const fish = objects.find((o) => o.id === 'fish');
      const bowl = objects.find((o) => o.id === 'bowl');
      const cat = objects.find((o) => o.id === 'cat');

      let isComplete = false;
      let isSecret = false;

      if (fish && bowl && cat) {
        // Primary: fish in bowl
        if (Math.abs(fish.x - bowl.x) < 50 && Math.abs(fish.y - bowl.y) < 40) {
          isComplete = true;
        }
        // Secret: cat jumped directly to fish on table
        if (cat.state?.tapped || (Math.abs(cat.x - fish.x) < 60 && Math.abs(cat.y - fish.y) < 60)) {
          isComplete = true;
          if (cat.state?.tapped) isSecret = true;
        }
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 4
  {
    id: 4,
    worldId: 1,
    title: 'TURN ON THE TV',
    objective: 'Turn on the TV!',
    hint: 'Tap the TV remote on the table, or tap the TV screen directly multiple times!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'tv',
        name: 'Television',
        x: 450,
        y: 400,
        vx: 0,
        vy: 0,
        width: 90,
        height: 70,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#1e293b',
        emoji: '📺',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
        tags: ['tv'],
      },
      {
        id: 'table',
        name: 'TV Stand',
        x: 450,
        y: 530,
        vx: 0,
        vy: 0,
        width: 140,
        height: 80,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#78350f',
        emoji: '🪵',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'remote',
        name: 'Remote Control',
        x: 200,
        y: 560,
        vx: 0,
        vy: 0,
        width: 40,
        height: 25,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#475569',
        emoji: '📻',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
        tags: ['remote'],
      },
      {
        id: 'char',
        name: 'Character',
        x: 100,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🧍',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
    ],
    checkConditions: (objects) => {
      const tv = objects.find((o) => o.id === 'tv');
      const remote = objects.find((o) => o.id === 'remote');

      let isComplete = false;
      let isSecret = false;

      if (remote && remote.state?.tapped) {
        isComplete = true;
      }

      if (tv && tv.state?.tapCount && tv.state.tapCount >= 2) {
        isComplete = true;
        isSecret = true;
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 5
  {
    id: 5,
    worldId: 1,
    title: 'GET THE CAKE WITHOUT TOUCHING THE TABLE',
    objective: 'Get the cake without directly interacting with the table!',
    hint: 'Avoid touching the table! Tap the ceiling fan switch or balloon!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'char',
        name: 'Character',
        x: 120,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🧍',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
      {
        id: 'table',
        name: 'Table',
        x: 380,
        y: 530,
        vx: 0,
        vy: 0,
        width: 140,
        height: 80,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#92400e',
        emoji: '🪵',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
        tags: ['table'],
      },
      {
        id: 'cake',
        name: 'Cake',
        x: 380,
        y: 460,
        vx: 0,
        vy: 0,
        width: 50,
        height: 40,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#f43f5e',
        emoji: '🎂',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.3,
        friction: 0.5,
        tags: ['cake', 'target'],
      },
      {
        id: 'fan',
        name: 'Ceiling Fan Switch',
        x: 380,
        y: 180,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#eab308',
        emoji: '🌬️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
        tags: ['fan'],
      },
    ],
    checkConditions: (objects) => {
      const table = objects.find((o) => o.id === 'table');
      const cake = objects.find((o) => o.id === 'cake');
      const char = objects.find((o) => o.id === 'char');
      const fan = objects.find((o) => o.id === 'fan');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (table && table.state?.tapped) {
        return { isComplete: false, isFailed: true, isSecret: false, failReason: 'Touched the table!' };
      }

      if (fan && fan.state?.tapped && cake) {
        // blow cake towards char
        cake.vx = -300;
        cake.vy = -100;
        isSecret = true;
      }

      if (cake && char) {
        if (Math.abs(cake.x - char.x) < 70 && Math.abs(cake.y - char.y) < 80) {
          isComplete = true;
        }
      }

      return { isComplete, isFailed, isSecret };
    },
  },

  // LEVEL 6
  {
    id: 6,
    worldId: 2,
    title: 'GET THE PIZZA',
    objective: 'Get pizza from the restaurant table!',
    hint: 'Drag pizza to plate or tap dinner bell!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'customer',
        name: 'Hungry Customer',
        x: 100,
        y: 520,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '😋',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
      {
        id: 'pizza',
        name: 'Hot Pizza',
        x: 420,
        y: 460,
        vx: 0,
        vy: 0,
        width: 50,
        height: 35,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#f97316',
        emoji: '🍕',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.6,
      },
      {
        id: 'bell',
        name: 'Service Bell',
        x: 320,
        y: 460,
        vx: 0,
        vy: 0,
        width: 35,
        height: 35,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#eab308',
        emoji: '🔔',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'table',
        name: 'Dining Table',
        x: 380,
        y: 530,
        vx: 0,
        vy: 0,
        width: 160,
        height: 80,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#b45309',
        emoji: '🍽️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const pizza = objects.find((o) => o.id === 'pizza');
      const customer = objects.find((o) => o.id === 'customer');
      const bell = objects.find((o) => o.id === 'bell');

      let isComplete = false;
      let isSecret = false;

      if (bell && bell.state?.tapped && pizza && customer) {
        pizza.x = customer.x + 20;
        pizza.y = customer.y;
        isComplete = true;
        isSecret = true;
      } else if (pizza && customer) {
        if (Math.abs(pizza.x - customer.x) < 70 && Math.abs(pizza.y - customer.y) < 80) {
          isComplete = true;
        }
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 7
  {
    id: 7,
    worldId: 2,
    title: 'STOP THE WAITER',
    objective: 'Prevent the waiter from spilling drinks!',
    hint: 'Tap the chair barrier before he slips, or tap his hat!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'waiter',
        name: 'Waiter',
        x: 100,
        y: 520,
        vx: 120, // moving right
        vy: 0,
        width: 50,
        height: 90,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'tap',
        color: '#1e293b',
        emoji: '🤵',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'tray',
        name: 'Drink Tray',
        x: 100,
        y: 450,
        vx: 120,
        vy: 0,
        width: 60,
        height: 25,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: false,
        interactionType: 'none',
        color: '#cbd5e1',
        emoji: '🍹',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'spill',
        name: 'Slippery Oil',
        x: 350,
        y: 610,
        vx: 0,
        vy: 0,
        width: 80,
        height: 10,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#eab308',
        emoji: '⚠️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.1,
      },
      {
        id: 'chair',
        name: 'Safety Barrier',
        x: 280,
        y: 550,
        vx: 0,
        vy: 0,
        width: 40,
        height: 60,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#ef4444',
        emoji: '🚧',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const waiter = objects.find((o) => o.id === 'waiter');
      const tray = objects.find((o) => o.id === 'tray');
      const chair = objects.find((o) => o.id === 'chair');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (waiter) {
        // keep tray attached to waiter
        if (tray && Math.abs(waiter.vx) > 0) {
          tray.x = waiter.x;
          tray.y = waiter.y - 60;
        }

        if (waiter.state?.tapped) {
          waiter.vx = 0;
          isComplete = true;
          isSecret = true;
        } else if (chair && chair.state?.tapped && waiter.x >= 240) {
          waiter.vx = 0;
          isComplete = true;
        } else if (waiter.x >= 350 && !isComplete) {
          // tripped!
          waiter.vx = 0;
          if (tray) tray.vy = 200;
          isFailed = true;
        }
      }

      return {
        isComplete,
        isFailed,
        isSecret,
        failReason: isFailed ? 'The waiter tripped and spilled the drinks!' : undefined,
      };
    },
  },

  // LEVEL 8
  {
    id: 8,
    worldId: 2,
    title: 'SAVE THE DRINK',
    objective: 'Save the drink before it slides off!',
    hint: 'Drag the drink away from the edge or place a coaster block under it!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'table',
        name: 'Slanted Table',
        x: 300,
        y: 500,
        vx: 0,
        vy: 0,
        width: 240,
        height: 60,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#92400e',
        emoji: '🪵',
        rotation: 0.1,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.2,
      },
      {
        id: 'drink',
        name: 'Fancy Cocktail',
        x: 380,
        y: 440,
        vx: 120, // sliding right
        vy: 0,
        width: 35,
        height: 50,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#f43f5e',
        emoji: '🍸',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.3,
      },
      {
        id: 'coaster',
        name: 'Magic Coaster',
        x: 100,
        y: 560,
        vx: 0,
        vy: 0,
        width: 50,
        height: 30,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#06b6d4',
        emoji: '🪙',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const drink = objects.find((o) => o.id === 'drink');
      const coaster = objects.find((o) => o.id === 'coaster');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (coaster && coaster.state?.tapped && drink) {
        drink.vx = 0;
        drink.x = 240;
        drink.y = 440;
        isComplete = true;
        isSecret = true;
      } else if (drink) {
        if (drink.x < 360 && drink.y < 580) {
          drink.vx = 0;
          isComplete = true;
        } else if (drink.y >= 600) {
          isFailed = true;
        }
      }

      return {
        isComplete,
        isFailed,
        isSecret,
        failReason: isFailed ? 'The drink fell and shattered!' : undefined,
      };
    },
  },

  // LEVEL 9
  {
    id: 9,
    worldId: 2,
    title: 'CATCH THE PLATE',
    objective: 'Catch the falling plate before it breaks!',
    hint: 'Drag the soft cushion under the plate or tap character hands!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 950,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'plate',
        name: 'Glass Plate',
        x: 300,
        y: 120,
        vx: 0,
        vy: 80, // falling down
        width: 50,
        height: 30,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: false,
        interactionType: 'none',
        color: '#e2e8f0',
        emoji: '🍽️',
        rotation: 0,
        angularVelocity: 2,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'cushion',
        name: 'Soft Cushion',
        x: 100,
        y: 560,
        vx: 0,
        vy: 0,
        width: 80,
        height: 40,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#a855f7',
        emoji: '🛋️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'char',
        name: 'Character',
        x: 300,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#3b82f6',
        emoji: '🙌',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
    ],
    checkConditions: (objects) => {
      const plate = objects.find((o) => o.id === 'plate');
      const cushion = objects.find((o) => o.id === 'cushion');
      const char = objects.find((o) => o.id === 'char');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (char && char.state?.tapped && plate) {
        plate.vy = 0;
        plate.y = char.y - 50;
        isComplete = true;
        isSecret = true;
      } else if (plate && cushion) {
        if (Math.abs(plate.x - cushion.x) < 50 && Math.abs(plate.y - cushion.y) < 30) {
          plate.vy = 0;
          isComplete = true;
        } else if (plate.y >= 600) {
          isFailed = true;
        }
      }

      return {
        isComplete,
        isFailed,
        isSecret,
        failReason: isFailed ? 'The plate shattered into pieces!' : undefined,
      };
    },
  },

  // LEVEL 10
  {
    id: 10,
    worldId: 2,
    title: 'SECRET KITCHEN',
    objective: 'Reach the secret kitchen route!',
    hint: 'Tap the main kitchen door, or find the secret poster curtain!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'door',
        name: 'Kitchen Door',
        x: 480,
        y: 480,
        vx: 0,
        vy: 0,
        width: 70,
        height: 140,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#78350f',
        emoji: '🚪',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'poster',
        name: 'VIP Poster Curtain',
        x: 260,
        y: 480,
        vx: 0,
        vy: 0,
        width: 80,
        height: 120,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#eab308',
        emoji: '🖼️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'char',
        name: 'Character',
        x: 100,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🧍',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
    ],
    checkConditions: (objects) => {
      const door = objects.find((o) => o.id === 'door');
      const poster = objects.find((o) => o.id === 'poster');

      let isComplete = false;
      let isSecret = false;

      if (poster && poster.state?.tapped) {
        isComplete = true;
        isSecret = true;
      } else if (door && door.state?.tapped) {
        isComplete = true;
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 11
  {
    id: 11,
    worldId: 3,
    title: 'BEACH BALL',
    objective: 'Roll the beach ball to the kid on the shore!',
    hint: 'Drag/roll ball down the hill, or tap beach umbrella for a high bounce!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'ball',
        name: 'Beach Ball',
        x: 140,
        y: 350,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        radius: 25,
        shape: 'circle',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#06b6d4',
        emoji: '🏖️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.8,
        friction: 0.2,
      },
      {
        id: 'kid',
        name: 'Beach Kid',
        x: 480,
        y: 530,
        vx: 0,
        vy: 0,
        width: 50,
        height: 70,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🧒',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
      {
        id: 'umbrella',
        name: 'Beach Umbrella',
        x: 300,
        y: 480,
        vx: 0,
        vy: 0,
        width: 70,
        height: 100,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#f43f5e',
        emoji: '☂️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.9,
        friction: 0.5,
      },
    ],
    checkConditions: (objects) => {
      const ball = objects.find((o) => o.id === 'ball');
      const kid = objects.find((o) => o.id === 'kid');
      const umbrella = objects.find((o) => o.id === 'umbrella');

      let isComplete = false;
      let isSecret = false;

      if (umbrella && umbrella.state?.tapped && ball) {
        ball.vx = 350;
        ball.vy = -300;
        isSecret = true;
      }

      if (ball && kid) {
        if (Math.abs(ball.x - kid.x) < 60 && Math.abs(ball.y - kid.y) < 70) {
          isComplete = true;
        }
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 12
  {
    id: 12,
    worldId: 3,
    title: 'SAVE THE UMBRELLA',
    objective: 'Prevent the beach umbrella from blowing away!',
    hint: 'Drag sandbag onto base or tap cooler box!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
      windX: 350, // gusty wind!
    },
    createObjects: () => [
      {
        id: 'umbrella',
        name: 'Beach Umbrella',
        x: 200,
        y: 480,
        vx: 0,
        vy: 0,
        width: 80,
        height: 120,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#ef4444',
        emoji: '☂️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
      {
        id: 'sandbag',
        name: 'Heavy Sandbag',
        x: 400,
        y: 560,
        vx: 0,
        vy: 0,
        width: 60,
        height: 40,
        shape: 'rect',
        mass: 5,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#b45309',
        emoji: '🪨',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'cooler',
        name: 'Ice Cooler Box',
        x: 100,
        y: 560,
        vx: 0,
        vy: 0,
        width: 50,
        height: 40,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#06b6d4',
        emoji: '🧊',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const umbrella = objects.find((o) => o.id === 'umbrella');
      const sandbag = objects.find((o) => o.id === 'sandbag');
      const cooler = objects.find((o) => o.id === 'cooler');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (cooler && cooler.state?.tapped && umbrella) {
        umbrella.x = cooler.x;
        umbrella.vx = 0;
        isComplete = true;
        isSecret = true;
      } else if (umbrella && sandbag) {
        if (Math.abs(umbrella.x - sandbag.x) < 50) {
          umbrella.vx = 0;
          isComplete = true;
        } else if (umbrella.x > 540) {
          isFailed = true;
        }
      }

      return {
        isComplete,
        isFailed,
        isSecret,
        failReason: isFailed ? 'The umbrella blew away into the ocean!' : undefined,
      };
    },
  },

  // LEVEL 13
  {
    id: 13,
    worldId: 3,
    title: 'FILL THE BUCKET',
    objective: 'Fill the sand bucket with water!',
    hint: 'Drag bucket under tap or tap ocean wave!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'bucket',
        name: 'Sand Bucket',
        x: 140,
        y: 560,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#eab308',
        emoji: '🪣',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.8,
      },
      {
        id: 'tap',
        name: 'Beach Shower Tap',
        x: 400,
        y: 350,
        vx: 0,
        vy: 0,
        width: 40,
        height: 180,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#64748b',
        emoji: '🚰',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'wave',
        name: 'Ocean Wave',
        x: 520,
        y: 560,
        vx: 0,
        vy: 0,
        width: 80,
        height: 60,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#0284c7',
        emoji: '🌊',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const bucket = objects.find((o) => o.id === 'bucket');
      const tap = objects.find((o) => o.id === 'tap');
      const wave = objects.find((o) => o.id === 'wave');

      let isComplete = false;
      let isSecret = false;

      if (wave && wave.state?.tapped && bucket) {
        bucket.x = wave.x - 30;
        isComplete = true;
        isSecret = true;
      } else if (bucket && tap) {
        if (tap.state?.tapped && Math.abs(bucket.x - tap.x) < 50) {
          isComplete = true;
        }
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 14
  {
    id: 14,
    worldId: 3,
    title: 'RESCUE THE TOY',
    objective: 'Retrieve the toy floating on ocean water!',
    hint: 'Drag lifebuoy or tap the sea turtle swimming by!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
      waterLineY: 520,
    },
    createObjects: () => [
      {
        id: 'toy',
        name: 'Floating Duck Toy',
        x: 480,
        y: 530,
        vx: 10,
        vy: 0,
        width: 40,
        height: 40,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: false,
        interactionType: 'none',
        color: '#facc15',
        emoji: '🦆',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.5,
        friction: 0.5,
      },
      {
        id: 'buoy',
        name: 'Lifebuoy Ring',
        x: 140,
        y: 500,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#ef4444',
        emoji: '🛟',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.5,
        friction: 0.5,
      },
      {
        id: 'turtle',
        name: 'Sea Turtle',
        x: 350,
        y: 550,
        vx: 0,
        vy: 0,
        width: 50,
        height: 35,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#15803d',
        emoji: '🐢',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const toy = objects.find((o) => o.id === 'toy');
      const buoy = objects.find((o) => o.id === 'buoy');
      const turtle = objects.find((o) => o.id === 'turtle');

      let isComplete = false;
      let isSecret = false;

      if (turtle && turtle.state?.tapped && toy) {
        toy.x = 100;
        toy.y = 500;
        isComplete = true;
        isSecret = true;
      } else if (toy && buoy) {
        if (Math.abs(toy.x - buoy.x) < 45) {
          toy.x = 100;
          isComplete = true;
        }
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 15
  {
    id: 15,
    worldId: 3,
    title: 'SECRET BEACH',
    objective: 'Get the coconut from the palm tree!',
    hint: 'Shake palm tree or bounce beach ball off crab into tree!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'tree',
        name: 'Palm Tree',
        x: 450,
        y: 380,
        vx: 0,
        vy: 0,
        width: 80,
        height: 240,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#15803d',
        emoji: '🌴',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'coconut',
        name: 'Golden Coconut',
        x: 450,
        y: 220,
        vx: 0,
        vy: 0,
        width: 40,
        height: 40,
        shape: 'rect',
        mass: 1,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#78350f',
        emoji: '🥥',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.3,
        friction: 0.7,
      },
      {
        id: 'crab',
        name: 'Playful Crab',
        x: 280,
        y: 580,
        vx: 0,
        vy: 0,
        width: 45,
        height: 35,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#ef4444',
        emoji: '🦀',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.9,
        friction: 0.5,
      },
      {
        id: 'ball',
        name: 'Beach Ball',
        x: 100,
        y: 560,
        vx: 0,
        vy: 0,
        width: 40,
        height: 40,
        radius: 20,
        shape: 'circle',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#3b82f6',
        emoji: '⚽',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.8,
        friction: 0.3,
      },
    ],
    checkConditions: (objects) => {
      const tree = objects.find((o) => o.id === 'tree');
      const coconut = objects.find((o) => o.id === 'coconut');
      const crab = objects.find((o) => o.id === 'crab');

      let isComplete = false;
      let isSecret = false;

      if (crab && crab.state?.tapped && coconut) {
        coconut.isStatic = false;
        coconut.vy = -200;
        isComplete = true;
        isSecret = true;
      } else if (tree && tree.state?.tapped && coconut) {
        coconut.isStatic = false;
        coconut.vy = 100;
        isComplete = true;
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 16
  {
    id: 16,
    worldId: 4,
    title: 'SAVE EVERYTHING',
    objective: 'Prevent 3 falling items from breaking at once!',
    hint: 'Drag cushions fast or tap the giant red emergency trampoline button!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 900,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'cake',
        name: 'Cake',
        x: 150,
        y: 100,
        vx: 0,
        vy: 100,
        width: 40,
        height: 35,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: false,
        interactionType: 'none',
        color: '#f43f5e',
        emoji: '🎂',
        rotation: 0,
        angularVelocity: 1,
        restitution: 0.2,
        friction: 0.5,
      },
      {
        id: 'vase',
        name: 'Vase',
        x: 300,
        y: 80,
        vx: 0,
        vy: 120,
        width: 40,
        height: 40,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: false,
        interactionType: 'none',
        color: '#06b6d4',
        emoji: '🏺',
        rotation: 0,
        angularVelocity: -2,
        restitution: 0.2,
        friction: 0.5,
      },
      {
        id: 'drink',
        name: 'Drink',
        x: 450,
        y: 120,
        vx: 0,
        vy: 90,
        width: 35,
        height: 45,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '🍹',
        rotation: 0,
        angularVelocity: 1.5,
        restitution: 0.2,
        friction: 0.5,
      },
      {
        id: 'button',
        name: 'Emergency Trampoline',
        x: 300,
        y: 580,
        vx: 0,
        vy: 0,
        width: 120,
        height: 40,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#ef4444',
        emoji: '🚨',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const button = objects.find((o) => o.id === 'button');
      const cake = objects.find((o) => o.id === 'cake');
      const vase = objects.find((o) => o.id === 'vase');
      const drink = objects.find((o) => o.id === 'drink');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (button && button.state?.tapped) {
        if (cake) cake.vy = -300;
        if (vase) vase.vy = -300;
        if (drink) drink.vy = -300;
        isComplete = true;
        isSecret = true;
      } else if (cake && vase && drink) {
        if (cake.y >= 600 || vase.y >= 600 || drink.y >= 600) {
          isFailed = true;
        }
      }

      return {
        isComplete,
        isFailed,
        isSecret,
        failReason: isFailed ? 'Items smashed onto the floor!' : undefined,
      };
    },
  },

  // LEVEL 17
  {
    id: 17,
    worldId: 4,
    title: 'CHAIN REACTION',
    objective: 'Trigger a domino chain reaction!',
    hint: 'Tap the starter red button or tap the cat laser pointer!',
    maxInteractionsFor2Stars: 1,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'domino',
        name: 'Starter Button',
        x: 100,
        y: 560,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#ef4444',
        emoji: '🔴',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'cat',
        name: 'Laser Cat',
        x: 480,
        y: 540,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#a855f7',
        emoji: '🐈‍⬛',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const domino = objects.find((o) => o.id === 'domino');
      const cat = objects.find((o) => o.id === 'cat');

      let isComplete = false;
      let isSecret = false;

      if (cat && cat.state?.tapped) {
        isComplete = true;
        isSecret = true;
      } else if (domino && domino.state?.tapped) {
        isComplete = true;
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 18
  {
    id: 18,
    worldId: 4,
    title: 'TOO FAST',
    objective: 'Deliver pizza slice in under 5 seconds!',
    hint: 'Drag pizza fast or tap the clock face to freeze time!',
    timeLimit: 5,
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'pizza',
        name: 'Fast Pizza',
        x: 120,
        y: 540,
        vx: 0,
        vy: 0,
        width: 45,
        height: 35,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#f97316',
        emoji: '🍕',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.2,
        friction: 0.6,
      },
      {
        id: 'customer',
        name: 'Impatient Customer',
        x: 480,
        y: 520,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#3b82f6',
        emoji: '⏰',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
      {
        id: 'clock',
        name: 'Time Freeze Clock',
        x: 300,
        y: 200,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#38bdf8',
        emoji: '⏱️',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects, stats) => {
      const pizza = objects.find((o) => o.id === 'pizza');
      const customer = objects.find((o) => o.id === 'customer');
      const clock = objects.find((o) => o.id === 'clock');

      let isComplete = false;
      let isFailed = false;
      let isSecret = false;

      if (clock && clock.state?.tapped) {
        if (pizza && customer) {
          pizza.x = customer.x;
          isComplete = true;
          isSecret = true;
        }
      } else if (pizza && customer) {
        if (Math.abs(pizza.x - customer.x) < 70 && Math.abs(pizza.y - customer.y) < 80) {
          isComplete = true;
        } else if (stats.timeElapsed >= 5) {
          isFailed = true;
        }
      }

      return {
        isComplete,
        isFailed,
        isSecret,
        failReason: isFailed ? 'Time expired! Customer walked away!' : undefined,
      };
    },
  },

  // LEVEL 19
  {
    id: 19,
    worldId: 4,
    title: 'FIND THE SECRET',
    objective: 'Discover the 3-star secret solution!',
    hint: 'Opening the gift box gives 2 stars. Swipe the red velvet curtain for 3 stars!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'box',
        name: 'Standard Gift Box',
        x: 200,
        y: 530,
        vx: 0,
        vy: 0,
        width: 70,
        height: 70,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#3b82f6',
        emoji: '🎁',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'curtain',
        name: 'Velvet Curtain',
        x: 440,
        y: 480,
        vx: 0,
        vy: 0,
        width: 100,
        height: 150,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#dc2626',
        emoji: '🎭',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
    ],
    checkConditions: (objects) => {
      const box = objects.find((o) => o.id === 'box');
      const curtain = objects.find((o) => o.id === 'curtain');

      let isComplete = false;
      let isSecret = false;

      if (curtain && curtain.state?.tapped) {
        isComplete = true;
        isSecret = true;
      } else if (box && box.state?.tapped) {
        isComplete = true;
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },

  // LEVEL 20
  {
    id: 20,
    worldId: 4,
    title: 'WRONG MOVE',
    objective: 'Final Challenge: Solve the ultimate physics puzzle!',
    hint: 'Tap the cat tail to trigger the legendary "Wrong Move" chain reaction!',
    maxInteractionsFor2Stars: 2,
    environment: {
      gravity: 800,
      groundY: 620,
      wallLeft: 20,
      wallRight: 580,
    },
    createObjects: () => [
      {
        id: 'cat',
        name: 'Chaos Cat',
        x: 100,
        y: 540,
        vx: 0,
        vy: 0,
        width: 50,
        height: 50,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: true,
        interactionType: 'tap',
        color: '#f97316',
        emoji: '🐈',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'waiter',
        name: 'Waiter',
        x: 250,
        y: 520,
        vx: 0,
        vy: 0,
        width: 50,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#1e293b',
        emoji: '🤵',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.9,
      },
      {
        id: 'cake',
        name: 'Grand Cake',
        x: 450,
        y: 460,
        vx: 0,
        vy: 0,
        width: 60,
        height: 50,
        shape: 'rect',
        mass: 1,
        isStatic: false,
        isInteractive: true,
        interactionType: 'drag',
        color: '#f43f5e',
        emoji: '🎂',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.3,
        friction: 0.5,
      },
      {
        id: 'player',
        name: 'Master Player',
        x: 350,
        y: 530,
        vx: 0,
        vy: 0,
        width: 60,
        height: 90,
        shape: 'rect',
        mass: 0,
        isStatic: true,
        isInteractive: false,
        interactionType: 'none',
        color: '#a855f7',
        emoji: '👑',
        rotation: 0,
        angularVelocity: 0,
        restitution: 0.1,
        friction: 0.8,
      },
    ],
    checkConditions: (objects) => {
      const cat = objects.find((o) => o.id === 'cat');
      const cake = objects.find((o) => o.id === 'cake');
      const player = objects.find((o) => o.id === 'player');

      let isComplete = false;
      let isSecret = false;

      if (cat && cat.state?.tapped && cake && player) {
        cake.x = player.x;
        cake.y = player.y - 50;
        isComplete = true;
        isSecret = true;
      } else if (cake && player) {
        if (Math.abs(cake.x - player.x) < 70 && Math.abs(cake.y - player.y) < 80) {
          isComplete = true;
        }
      }

      return { isComplete, isFailed: false, isSecret };
    },
  },
];
