'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface PrimeTreasureGameProps {
  level: number;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export default function PrimeTreasureGame({ level, onComplete, onExit }: PrimeTreasureGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const gameState = {
      score: 0,
      lives: 3,
      combo: 0,
      level: level,
      chests: [] as any[],
    };

    // Check if number is prime
    const isPrime = (num: number): boolean => {
      if (num < 2) return false;
      if (num === 2) return true;
      if (num % 2 === 0) return false;
      for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
      }
      return true;
    };

    // Generate number based on level
    const generateNumber = (difficulty: number): { num: number, isPrime: boolean } => {
      let num: number;
      const shouldBePrime = Math.random() > 0.5;
      
      if (difficulty === 1) {
        // Level 1: Numbers 1-30
        if (shouldBePrime) {
          num = Phaser.Math.RND.pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
        } else {
          num = Phaser.Math.RND.pick([1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30]);
        }
      } else if (difficulty === 2) {
        // Level 2: Numbers 1-60
        if (shouldBePrime) {
          num = Phaser.Math.RND.pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]);
        } else {
          num = Phaser.Math.Between(1, 60);
          while (isPrime(num)) {
            num = Phaser.Math.Between(1, 60);
          }
        }
      } else {
        // Level 3+: Numbers 1-100
        if (shouldBePrime) {
          const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
          num = Phaser.Math.RND.pick(primes);
        } else {
          num = Phaser.Math.Between(1, 100);
          while (isPrime(num)) {
            num = Phaser.Math.Between(1, 100);
          }
        }
      }
      
      return { num, isPrime: isPrime(num) };
    };

    class GameScene extends Phaser.Scene {
      private chests!: Phaser.GameObjects.Group;
      private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
      private scoreText!: Phaser.GameObjects.Text;
      private livesText!: Phaser.GameObjects.Text;
      private comboText!: Phaser.GameObjects.Text;
      private spawnTimer!: Phaser.Time.TimerEvent;
      private bubbles: any[] = [];

      constructor() {
        super({ key: 'GameScene' });
      }

      preload() {
        this.createGraphics();
      }

      createGraphics() {
        // Treasure chest (closed)
        const chest = this.add.graphics();
        
        // Chest body
        chest.fillStyle(0x8b4513, 1);
        chest.fillRect(15, 25, 70, 45);
        
        // Chest lid
        chest.fillStyle(0x654321, 1);
        chest.beginPath();
        chest.moveTo(10, 25);
        chest.lineTo(50, 10);
        chest.lineTo(90, 25);
        chest.lineTo(85, 30);
        chest.lineTo(50, 18);
        chest.lineTo(15, 30);
        chest.closePath();
        chest.fillPath();
        
        // Lock
        chest.fillStyle(0xffd700, 1);
        chest.fillCircle(50, 40, 8);
        chest.fillRect(47, 40, 6, 15);
        
        // Bands
        chest.lineStyle(3, 0x000000, 0.3);
        chest.strokeRect(15, 30, 70, 10);
        chest.strokeRect(15, 50, 70, 10);
        
        chest.generateTexture('chest', 100, 80);
        chest.destroy();

        // Gem/treasure
        const gem = this.add.graphics();
        gem.fillStyle(0x00ffff, 1);
        gem.fillCircle(20, 20, 15);
        gem.fillStyle(0xffffff, 0.6);
        gem.fillCircle(15, 15, 6);
        gem.generateTexture('gem', 40, 40);
        gem.destroy();

        // Bubble
        const bubble = this.add.graphics();
        bubble.lineStyle(2, 0xffffff, 0.6);
        bubble.strokeCircle(15, 15, 12);
        bubble.fillStyle(0xffffff, 0.1);
        bubble.fillCircle(15, 15, 12);
        bubble.fillStyle(0xffffff, 0.4);
        bubble.fillCircle(12, 12, 4);
        bubble.generateTexture('bubble', 30, 30);
        bubble.destroy();

        // Particle
        const particle = this.add.graphics();
        particle.fillStyle(0x00ffff, 1);
        particle.fillCircle(4, 4, 4);
        particle.generateTexture('particle', 8, 8);
        particle.destroy();
      }

      create() {
        // Underwater gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x001f3f, 0x001f3f, 0x003d5c, 0x005f7f, 1);
        bg.fillRect(0, 0, 800, 600);

        // Coral/seaweed decorations
        this.addSeaweed();

        this.chests = this.add.group();

        // Bubble particles
        this.particles = this.add.particles(0, 0, 'particle', {
          speed: { min: 100, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 1.5, end: 0 },
          lifespan: 800,
          gravityY: -100,
          emitting: false,
        });

        // Floating bubbles background
        for (let i = 0; i < 15; i++) {
          this.time.delayedCall(i * 200, () => this.createBubble());
        }

        // UI
        this.scoreText = this.add.text(30, 30, 'Score: 0', {
          fontSize: '28px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#001f3f',
          strokeThickness: 4,
        });

        this.livesText = this.add.text(30, 70, '💎 💎 💎', {
          fontSize: '28px',
        });

        this.comboText = this.add.text(400, 30, 'Combo: 0x', {
          fontSize: '24px',
          color: '#00ffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#001f3f',
          strokeThickness: 4,
        }).setOrigin(0.5, 0);

        // Instructions
        const instructionsBg = this.add.rectangle(400, 550, 760, 80, 0x001f3f, 0.9);
        instructionsBg.setStrokeStyle(4, 0x00ffff);
        
        this.add.text(400, 530, 'Click ONLY the PRIME number chests to collect treasure!', {
          fontSize: '22px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          align: 'center',
        }).setOrigin(0.5);

        this.add.text(400, 560, 'Avoid composite numbers or lose a life! 💎', {
          fontSize: '18px',
          color: '#00ffff',
          fontFamily: 'DM Sans, sans-serif',
          align: 'center',
        }).setOrigin(0.5);

        // Spawn timer
        this.spawnTimer = this.time.addEvent({
          delay: 2000 - (gameState.level * 200),
          callback: this.spawnChest,
          callbackScope: this,
          loop: true,
        });

        this.time.delayedCall(300, () => this.spawnChest());
        this.time.delayedCall(900, () => this.spawnChest());
      }

      addSeaweed() {
        for (let i = 0; i < 8; i++) {
          const x = i * 100 + 50;
          const seaweed = this.add.graphics();
          
          seaweed.lineStyle(8, 0x2d5016, 1);
          seaweed.beginPath();
          seaweed.moveTo(x, 600);
          
          for (let y = 600; y > 450; y -= 20) {
            const wobble = Math.sin(y / 30) * 15;
            seaweed.lineTo(x + wobble, y);
          }
          seaweed.strokePath();
          
          // Animate
          this.tweens.add({
            targets: seaweed,
            alpha: 0.6,
            duration: Phaser.Math.Between(2000, 4000),
            yoyo: true,
            repeat: -1,
          });
        }
      }

      createBubble() {
        const x = Phaser.Math.Between(50, 750);
        const bubble = this.add.sprite(x, 620, 'bubble');
        bubble.setAlpha(0.6);
        
        this.tweens.add({
          targets: bubble,
          y: -50,
          duration: Phaser.Math.Between(4000, 8000),
          ease: 'Linear',
          onComplete: () => {
            bubble.destroy();
            this.time.delayedCall(Phaser.Math.Between(500, 2000), () => this.createBubble());
          },
        });

        this.tweens.add({
          targets: bubble,
          x: x + Phaser.Math.Between(-30, 30),
          duration: 2000,
          yoyo: true,
          repeat: -1,
        });
      }

      spawnChest() {
        const data = generateNumber(gameState.level);
        const x = Phaser.Math.Between(100, 700);
        
        const container = this.add.container(x, Phaser.Math.Between(-50, -150));
        
        // Chest sprite
        const chestSprite = this.add.sprite(0, 0, 'chest');
        chestSprite.setScale(0.9);
        container.add(chestSprite);

        // Number text
        const numberText = this.add.text(0, -15, data.num.toString(), {
          fontSize: '32px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 5,
        }).setOrigin(0.5);
        container.add(numberText);

        // Glow for primes
        if (data.isPrime) {
          const glow = this.add.circle(0, 0, 55, 0x00ffff, 0.3);
          container.addAt(glow, 0);
          
          this.tweens.add({
            targets: glow,
            alpha: 0.6,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
          });
        }

        container.setData('number', data.num);
        container.setData('isPrime', data.isPrime);
        container.setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains);
        
        container.on('pointerdown', () => {
          this.clickChest(container);
        });

        this.chests.add(container);
        gameState.chests.push(container);

        // Float down
        this.tweens.add({
          targets: container,
          y: 650,
          duration: 8000 - (gameState.level * 600),
          ease: 'Linear',
          onComplete: () => {
            this.chestEscaped(container);
          },
        });

        // Sway animation
        this.tweens.add({
          targets: container,
          x: x + Phaser.Math.Between(-25, 25),
          duration: 2000,
          yoyo: true,
          repeat: -1,
        });
      }

      clickChest(chest: any) {
        if (!chest.active) return;

        const isPrime = chest.getData('isPrime');
        const number = chest.getData('number');

        if (isPrime) {
          this.correctChoice(chest);
        } else {
          this.wrongChoice(chest);
        }
      }

      correctChoice(chest: any) {
        if (!chest.active) return;

        // Particles
        this.particles.setPosition(chest.x, chest.y);
        this.particles.setParticleTint(0x00ffff);
        this.particles.explode(30);

        // Show gem
        const gem = this.add.sprite(chest.x, chest.y, 'gem');
        this.tweens.add({
          targets: gem,
          y: gem.y - 80,
          alpha: 0,
          scale: 1.5,
          duration: 1000,
          onComplete: () => gem.destroy(),
        });

        // Combo
        gameState.combo++;
        setCombo(gameState.combo);
        this.comboText.setText(`Combo: ${gameState.combo}x`);
        
        const multiplier = Math.min(gameState.combo, 5);
        const points = (10 + gameState.level * 5) * multiplier;
        
        gameState.score += points;
        setScore(gameState.score);
        this.scoreText.setText(`Score: ${gameState.score}`);

        // Points popup
        const pointsText = this.add.text(chest.x, chest.y, `+${points}`, {
          fontSize: '32px',
          color: '#00ffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#ffffff',
          strokeThickness: 4,
        }).setOrigin(0.5);

        this.tweens.add({
          targets: pointsText,
          y: chest.y - 60,
          alpha: 0,
          duration: 1000,
          onComplete: () => pointsText.destroy(),
        });

        chest.destroy();
        const index = gameState.chests.indexOf(chest);
        if (index > -1) gameState.chests.splice(index, 1);
      }

      wrongChoice(chest: any) {
        if (!chest.active) return;

        // Reset combo
        gameState.combo = 0;
        setCombo(0);
        this.comboText.setText('Combo: 0x');

        // Explosion
        this.particles.setPosition(chest.x, chest.y);
        this.particles.setParticleTint(0xff0000);
        this.particles.explode(20);

        // Red X
        const wrongText = this.add.text(chest.x, chest.y, '✗', {
          fontSize: '64px',
          color: '#ff0000',
          fontFamily: 'Arial',
          fontStyle: 'bold',
        }).setOrigin(0.5);

        this.tweens.add({
          targets: wrongText,
          y: wrongText.y - 50,
          alpha: 0,
          duration: 800,
          onComplete: () => wrongText.destroy(),
        });

        chest.destroy();
        const index = gameState.chests.indexOf(chest);
        if (index > -1) gameState.chests.splice(index, 1);

        // Lose life
        gameState.lives--;
        setLives(gameState.lives);
        this.updateLivesDisplay();
        this.cameras.main.shake(200, 0.01);

        if (gameState.lives <= 0) {
          this.gameOver();
        }
      }

      chestEscaped(chest: any) {
        if (!chest.active) return;

        const isPrime = chest.getData('isPrime');
        
        chest.destroy();
        const index = gameState.chests.indexOf(chest);
        if (index > -1) gameState.chests.splice(index, 1);

        // Only lose life if it was a prime that escaped
        if (isPrime) {
          gameState.lives--;
          setLives(gameState.lives);
          this.updateLivesDisplay();
          this.cameras.main.shake(150, 0.008);

          // Reset combo
          gameState.combo = 0;
          setCombo(0);
          this.comboText.setText('Combo: 0x');

          if (gameState.lives <= 0) {
            this.gameOver();
          }
        }
      }

      updateLivesDisplay() {
        const gems = '💎 '.repeat(Math.max(0, gameState.lives));
        const empty = '⬛ '.repeat(Math.max(0, 3 - gameState.lives));
        this.livesText.setText(gems + empty);
      }

      gameOver() {
        this.spawnTimer.destroy();
        this.chests.clear(true, true);
        gameState.chests = [];

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x001f3f, 0.95);
        
        this.add.text(400, 250, 'Game Over!', {
          fontSize: '64px',
          color: '#00ffff',
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

        const stars = gameState.score >= 200 ? 3 : gameState.score >= 100 ? 2 : 1;
        
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
      backgroundColor: '#001f3f',
      scene: GameScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, [level, onComplete]);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={gameRef} 
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-cyan-500"
        style={{ maxWidth: '800px', width: '100%' }}
      />

      <div className="mt-6 w-full max-w-2xl">
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-2xl p-6 shadow-xl border-4 border-cyan-500">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-display font-bold text-cyan-300 mb-2">
              Prime Numbers Treasure Hunt
            </h3>
            <p className="text-white font-body">
              Click only the chests with <span className="text-cyan-300 font-bold">PRIME</span> numbers!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-950 rounded-xl p-4 text-center border-2 border-cyan-600">
              <div className="text-sm text-cyan-400 font-display font-semibold mb-1">
                Current Combo
              </div>
              <div className="text-3xl font-display font-bold text-cyan-300">
                {combo}x
              </div>
            </div>

            <div className="bg-cyan-950 rounded-xl p-4 text-center border-2 border-cyan-600">
              <div className="text-sm text-cyan-400 font-display font-semibold mb-1">
                Multiplier
              </div>
              <div className="text-3xl font-display font-bold text-yellow-400">
                {Math.min(combo, 5)}x
              </div>
            </div>
          </div>

          <div className="mt-4 bg-cyan-950 rounded-xl p-4 border-2 border-cyan-600">
            <div className="text-xs text-cyan-400 font-body mb-2">
              💡 Tip: Build combos by clicking primes in a row! Max 5x multiplier
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-display font-bold shadow-lg">
          Score: {score}
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-display font-bold shadow-lg">
          Lives: {'💎'.repeat(lives)}
        </div>
      </div>
    </div>
  );
}
