'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface PizzaPartyGameProps {
  level: number;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export default function PizzaPartyGame({ level, onComplete, onExit }: PizzaPartyGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentFraction, setCurrentFraction] = useState<string | null>(null);
  const [selectedSlices, setSelectedSlices] = useState(0);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const gameState = {
      score: 0,
      lives: 3,
      level: level,
      pizzas: [] as any[],
      currentPizza: null as any,
    };

    // Generate fraction based on level
    const generateFraction = (difficulty: number) => {
      let numerator, denominator;
      
      if (difficulty === 1) {
        // Level 1: Simple fractions (halves, thirds, quarters)
        const options = [
          { num: 1, den: 2 }, { num: 1, den: 3 }, { num: 2, den: 3 },
          { num: 1, den: 4 }, { num: 3, den: 4 }
        ];
        const choice = Phaser.Math.RND.pick(options);
        return { numerator: choice.num, denominator: choice.den };
      } else if (difficulty === 2) {
        // Level 2: More variety (up to eighths)
        denominator = Phaser.Math.RND.pick([2, 3, 4, 5, 6, 8]);
        numerator = Phaser.Math.Between(1, denominator - 1);
        return { numerator, denominator };
      } else {
        // Level 3+: All fractions up to twelfths
        denominator = Phaser.Math.RND.pick([2, 3, 4, 5, 6, 8, 10, 12]);
        numerator = Phaser.Math.Between(1, denominator - 1);
        return { numerator, denominator };
      }
    };

    class GameScene extends Phaser.Scene {
      private pizzas!: Phaser.GameObjects.Group;
      private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
      private scoreText!: Phaser.GameObjects.Text;
      private livesText!: Phaser.GameObjects.Text;
      private spawnTimer!: Phaser.Time.TimerEvent;
      private currentPizza: any = null;

      constructor() {
        super({ key: 'GameScene' });
      }

      preload() {
        this.createPizzaGraphics();
      }

      createPizzaGraphics() {
        // Create pizza base
        const pizza = this.add.graphics();
        
        // Pizza crust (outer circle)
        pizza.fillStyle(0xd4a574, 1);
        pizza.fillCircle(60, 60, 55);
        
        // Pizza cheese (inner)
        pizza.fillStyle(0xffd700, 1);
        pizza.fillCircle(60, 60, 50);
        
        // Pepperoni
        const pepperoniPositions = [
          [40, 40], [80, 40], [60, 60], [40, 80], [80, 80]
        ];
        pizza.fillStyle(0xc41e3a, 1);
        pepperoniPositions.forEach(([x, y]) => {
          pizza.fillCircle(x, y, 8);
        });
        
        pizza.generateTexture('pizza', 120, 120);
        pizza.destroy();

        // Create pizza slice
        const slice = this.add.graphics();
        slice.fillStyle(0xffd700, 1);
        slice.slice(50, 50, 45, Phaser.Math.DegToRad(-15), Phaser.Math.DegToRad(15), false);
        slice.fillPath();
        
        // Crust edge
        slice.lineStyle(4, 0xd4a574, 1);
        slice.beginPath();
        slice.arc(50, 50, 45, Phaser.Math.DegToRad(-15), Phaser.Math.DegToRad(15), false);
        slice.strokePath();
        
        // Lines to center
        slice.lineBetween(50, 50, 
          50 + 45 * Math.cos(Phaser.Math.DegToRad(-15)),
          50 + 45 * Math.sin(Phaser.Math.DegToRad(-15)));
        slice.lineBetween(50, 50,
          50 + 45 * Math.cos(Phaser.Math.DegToRad(15)),
          50 + 45 * Math.sin(Phaser.Math.DegToRad(15)));
        
        slice.generateTexture('slice', 100, 100);
        slice.destroy();

        // Particle
        const particle = this.add.graphics();
        particle.fillStyle(0xffd700, 1);
        particle.fillCircle(4, 4, 4);
        particle.generateTexture('particle', 8, 8);
        particle.destroy();
      }

      create() {
        // Checkered tablecloth background
        const bg = this.add.graphics();
        const checkSize = 40;
        for (let x = 0; x < 800; x += checkSize) {
          for (let y = 0; y < 600; y += checkSize) {
            const isRed = ((x / checkSize) + (y / checkSize)) % 2 === 0;
            bg.fillStyle(isRed ? 0xcc0000 : 0xffffff, 1);
            bg.fillRect(x, y, checkSize, checkSize);
          }
        }

        // Wood table border
        const border = this.add.graphics();
        border.fillStyle(0x8b4513, 1);
        border.fillRect(0, 0, 800, 20);
        border.fillRect(0, 580, 800, 20);
        border.fillRect(0, 0, 20, 600);
        border.fillRect(780, 0, 20, 600);

        this.pizzas = this.add.group();

        // Particles
        this.particles = this.add.particles(0, 0, 'particle', {
          speed: { min: 100, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 1, end: 0 },
          lifespan: 600,
          gravityY: 200,
          emitting: false,
        });

        // UI
        this.scoreText = this.add.text(40, 30, 'Score: 0', {
          fontSize: '28px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#8b4513',
          strokeThickness: 4,
        });

        this.livesText = this.add.text(40, 70, '🍕 🍕 🍕', {
          fontSize: '28px',
        });

        // Instructions
        const instructionsBg = this.add.rectangle(400, 550, 760, 80, 0x8b4513, 0.9);
        instructionsBg.setStrokeStyle(4, 0xffd700);
        
        this.add.text(400, 530, 'Click the pizza slices to match the fraction!', {
          fontSize: '22px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          align: 'center',
        }).setOrigin(0.5);

        this.add.text(400, 560, 'Select the right number of slices, then click CHECK! 🍕', {
          fontSize: '18px',
          color: '#ffd700',
          fontFamily: 'DM Sans, sans-serif',
          align: 'center',
        }).setOrigin(0.5);

        // Spawn timer
        this.spawnTimer = this.time.addEvent({
          delay: 4000 - (gameState.level * 300),
          callback: this.spawnPizza,
          callbackScope: this,
          loop: true,
        });

        this.time.delayedCall(500, () => this.spawnPizza());
      }

      spawnPizza() {
        const fraction = generateFraction(gameState.level);
        const x = Phaser.Math.Between(150, 650);
        
        // Container for pizza
        const container = this.add.container(x, -100);
        
        // Pizza base
        const pizzaSprite = this.add.sprite(0, 0, 'pizza');
        pizzaSprite.setScale(1.2);
        container.add(pizzaSprite);

        // Fraction text
        const fractionText = this.add.text(0, 0, `${fraction.numerator}/${fraction.denominator}`, {
          fontSize: '32px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#8b4513',
          strokeThickness: 5,
        }).setOrigin(0.5);
        container.add(fractionText);

        // Create slices around the pizza
        const slices: any[] = [];
        const anglePerSlice = 360 / fraction.denominator;
        const radius = 100;
        
        for (let i = 0; i < fraction.denominator; i++) {
          const angle = Phaser.Math.DegToRad(i * anglePerSlice - 90);
          const sliceX = Math.cos(angle) * radius;
          const sliceY = Math.sin(angle) * radius;
          
          const slice = this.add.sprite(sliceX, sliceY, 'slice');
          slice.setScale(0.6);
          slice.setRotation(angle + Phaser.Math.DegToRad(90));
          slice.setInteractive();
          slice.setData('selected', false);
          slice.setData('index', i);
          
          // Click handler
          slice.on('pointerdown', () => {
            if (!slice.getData('selected')) {
              slice.setData('selected', true);
              slice.setTint(0x44ff44);
              const current = (window as any).selectedSlices || 0;
              (window as any).selectedSlices = current + 1;
              setSelectedSlices(current + 1);
            } else {
              slice.setData('selected', false);
              slice.clearTint();
              const current = (window as any).selectedSlices || 0;
              (window as any).selectedSlices = Math.max(0, current - 1);
              setSelectedSlices(Math.max(0, current - 1));
            }
          });
          
          slices.push(slice);
          container.add(slice);
        }

        container.setData('fraction', fraction);
        container.setData('slices', slices);
        container.setData('container', container);
        container.setData('id', Date.now());

        this.pizzas.add(container);
        gameState.pizzas.push(container);

        // Fall animation
        this.tweens.add({
          targets: container,
          y: 650,
          duration: 10000 - (gameState.level * 1000),
          ease: 'Linear',
          onComplete: () => {
            this.pizzaEscaped(container);
          },
        });

        // Auto-select first pizza
        if (!this.currentPizza) {
          this.selectPizza(container);
        }
      }

      selectPizza(pizza: any) {
        if (this.currentPizza) {
          this.currentPizza.list[0].clearTint();
        }

        this.currentPizza = pizza;
        pizza.list[0].setTint(0xffff44);
        
        const fraction = pizza.getData('fraction');
        setCurrentFraction(`${fraction.numerator}/${fraction.denominator}`);
        (window as any).selectedSlices = 0;
        setSelectedSlices(0);
      }

      checkAnswer() {
        if (!this.currentPizza || !this.currentPizza.active) return;

        const fraction = this.currentPizza.getData('fraction');
        const selected = (window as any).selectedSlices || 0;

        if (selected === fraction.numerator) {
          this.correctAnswer(this.currentPizza);
        } else {
          this.wrongAnswer();
        }
      }

      correctAnswer(pizza: any) {
        if (!pizza.active) return;

        // Particles
        this.particles.setPosition(pizza.x, pizza.y);
        this.particles.setParticleTint(0xffd700);
        this.particles.explode(25);

        // Score
        gameState.score += 15 + (gameState.level * 5);
        setScore(gameState.score);
        this.scoreText.setText(`Score: ${gameState.score}`);

        // Points popup
        const points = this.add.text(pizza.x, pizza.y, `+${15 + (gameState.level * 5)}`, {
          fontSize: '36px',
          color: '#ffd700',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#8b4513',
          strokeThickness: 4,
        }).setOrigin(0.5);

        this.tweens.add({
          targets: points,
          y: pizza.y - 60,
          alpha: 0,
          duration: 1000,
          onComplete: () => points.destroy(),
        });

        // Remove pizza
        pizza.destroy();
        const index = gameState.pizzas.indexOf(pizza);
        if (index > -1) gameState.pizzas.splice(index, 1);

        // Select next
        this.currentPizza = null;
        (window as any).selectedSlices = 0;
        setSelectedSlices(0);
        if (gameState.pizzas.length > 0) {
          this.selectPizza(gameState.pizzas[0]);
        } else {
          setCurrentFraction(null);
        }
      }

      wrongAnswer() {
        // Shake
        this.cameras.main.shake(150, 0.005);
        
        // Red flash
        const overlay = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.3);
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 300,
          onComplete: () => overlay.destroy(),
        });
      }

      pizzaEscaped(pizza: any) {
        if (!pizza.active) return;

        pizza.destroy();
        const index = gameState.pizzas.indexOf(pizza);
        if (index > -1) gameState.pizzas.splice(index, 1);

        if (this.currentPizza === pizza) {
          this.currentPizza = null;
          (window as any).selectedSlices = 0;
          setSelectedSlices(0);
          if (gameState.pizzas.length > 0) {
            this.selectPizza(gameState.pizzas[0]);
          } else {
            setCurrentFraction(null);
          }
        }

        gameState.lives--;
        setLives(gameState.lives);
        this.updateLivesDisplay();
        this.cameras.main.shake(200, 0.01);

        if (gameState.lives <= 0) {
          this.gameOver();
        }
      }

      updateLivesDisplay() {
        const pizzas = '🍕 '.repeat(Math.max(0, gameState.lives));
        const empty = '⬜ '.repeat(Math.max(0, 3 - gameState.lives));
        this.livesText.setText(pizzas + empty);
      }

      gameOver() {
        this.spawnTimer.destroy();
        this.pizzas.clear(true, true);
        gameState.pizzas = [];

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x8b4513, 0.9);
        
        this.add.text(400, 250, 'Game Over!', {
          fontSize: '64px',
          color: '#ffd700',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#ffffff',
          strokeThickness: 6,
        }).setOrigin(0.5);

        this.add.text(400, 330, `Final Score: ${gameState.score}`, {
          fontSize: '32px',
          color: '#ffffff',
          fontFamily: 'DM Sans, sans-serif',
        }).setOrigin(0.5);

        const stars = gameState.score >= 150 ? 3 : gameState.score >= 75 ? 2 : 1;
        
        this.time.delayedCall(2000, () => {
          onComplete(gameState.score, stars);
        });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      scene: GameScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    (window as any).selectedSlices = 0;
    (window as any).checkPizzaAnswer = () => {
      const scene = game.scene.getScene('GameScene') as any;
      if (scene && scene.checkAnswer) {
        scene.checkAnswer();
      }
    };

    return () => {
      game.destroy(true);
      delete (window as any).checkPizzaAnswer;
      delete (window as any).selectedSlices;
    };
  }, [level, onComplete]);

  const handleCheck = () => {
    (window as any).checkPizzaAnswer?.();
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={gameRef} 
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-600"
        style={{ maxWidth: '800px', width: '100%' }}
      />

      <div className="mt-6 w-full max-w-2xl">
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="mb-4">
            <div className="text-sm font-display font-semibold text-orange-800 mb-2">
              Current Fraction:
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-orange-300">
              {currentFraction ? (
                <div className="text-4xl font-display font-bold text-orange-600">
                  {currentFraction}
                </div>
              ) : (
                <div className="text-lg font-body text-gray-500">
                  No pizza selected
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-display font-semibold text-orange-800 mb-2">
              Slices Selected:
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-orange-300">
              <div className="text-3xl font-display font-bold text-green-600">
                {selectedSlices}
              </div>
            </div>
          </div>

          <button
            onClick={handleCheck}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-display font-bold text-xl shadow-lg hover:scale-105 transition-transform"
          >
            Check Answer! 🍕
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-display font-bold shadow-lg">
          Score: {score}
        </div>
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-display font-bold shadow-lg">
          Lives: {'🍕'.repeat(lives)}
        </div>
      </div>
    </div>
  );
}
