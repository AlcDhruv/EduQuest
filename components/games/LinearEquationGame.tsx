'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface LinearEquationGameProps {
  level: number;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export default function LinearEquationGame({ level, onComplete, onExit }: LinearEquationGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [targetBalloon, setTargetBalloon] = useState<string | null>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    // Game state shared between Phaser and React
    const gameState = {
      score: 0,
      lives: 3,
      level: level,
      balloons: [] as any[],
      targetBalloon: null as any,
      equations: [] as any[],
    };

    // Generate equations based on level with variety
    const generateEquation = (difficulty: number) => {
      let a, b, c, x;
      const rand = Math.random();
      
      if (difficulty === 1) {
        // Level 1: Mix of simple formats
        if (rand < 0.25) {
          // Type 1: x = a (simplest)
          x = Phaser.Math.Between(1, 15);
          return { equation: `x = ${x}`, answer: x };
        } else if (rand < 0.5) {
          // Type 2: x + a = b
          x = Phaser.Math.Between(1, 10);
          a = Phaser.Math.Between(1, 10);
          b = x + a;
          return { equation: `x + ${a} = ${b}`, answer: x };
        } else if (rand < 0.75) {
          // Type 3: a + x = b
          x = Phaser.Math.Between(1, 10);
          a = Phaser.Math.Between(1, 10);
          b = a + x;
          return { equation: `${a} + x = ${b}`, answer: x };
        } else {
          // Type 4: x - a = b
          x = Phaser.Math.Between(5, 15);
          a = Phaser.Math.Between(1, x - 1);
          b = x - a;
          return { equation: `x - ${a} = ${b}`, answer: x };
        }
      } else if (difficulty === 2) {
        // Level 2: More variety with subtraction and multi-step
        if (rand < 0.2) {
          // Type 1: a - x = b
          x = Phaser.Math.Between(1, 10);
          a = Phaser.Math.Between(x + 1, 20);
          b = a - x;
          return { equation: `${a} - x = ${b}`, answer: x };
        } else if (rand < 0.4) {
          // Type 2: x + a = b (larger numbers)
          x = Phaser.Math.Between(5, 20);
          a = Phaser.Math.Between(5, 20);
          b = x + a;
          return { equation: `x + ${a} = ${b}`, answer: x };
        } else if (rand < 0.6) {
          // Type 3: x - a = b
          x = Phaser.Math.Between(10, 25);
          a = Phaser.Math.Between(1, 15);
          b = x - a;
          return { equation: `x - ${a} = ${b}`, answer: x };
        } else if (rand < 0.8) {
          // Type 4: x + a + b = c
          x = Phaser.Math.Between(1, 10);
          a = Phaser.Math.Between(1, 8);
          b = Phaser.Math.Between(1, 8);
          c = x + a + b;
          return { equation: `x + ${a} + ${b} = ${c}`, answer: x };
        } else {
          // Type 5: x - a - b = c
          x = Phaser.Math.Between(10, 20);
          a = Phaser.Math.Between(1, 5);
          b = Phaser.Math.Between(1, 5);
          c = x - a - b;
          return { equation: `x - ${a} - ${b} = ${c}`, answer: x };
        }
      } else {
        // Level 3+: Include multiplication and complex forms
        if (rand < 0.15) {
          // Type 1: ax = b
          a = Phaser.Math.Between(2, 6);
          x = Phaser.Math.Between(1, 10);
          b = a * x;
          return { equation: `${a}x = ${b}`, answer: x };
        } else if (rand < 0.35) {
          // Type 2: ax + b = c
          a = Phaser.Math.Between(2, 5);
          x = Phaser.Math.Between(1, 10);
          b = Phaser.Math.Between(1, 15);
          c = a * x + b;
          return { equation: `${a}x + ${b} = ${c}`, answer: x };
        } else if (rand < 0.55) {
          // Type 3: ax - b = c
          a = Phaser.Math.Between(2, 5);
          x = Phaser.Math.Between(2, 10);
          b = Phaser.Math.Between(1, 10);
          c = a * x - b;
          return { equation: `${a}x - ${b} = ${c}`, answer: x };
        } else if (rand < 0.7) {
          // Type 4: a + bx = c
          a = Phaser.Math.Between(1, 10);
          b = Phaser.Math.Between(2, 5);
          x = Phaser.Math.Between(1, 8);
          c = a + b * x;
          return { equation: `${a} + ${b}x = ${c}`, answer: x };
        } else if (rand < 0.85) {
          // Type 5: ax + b + c = d (multi-step)
          a = Phaser.Math.Between(2, 4);
          x = Phaser.Math.Between(1, 8);
          b = Phaser.Math.Between(1, 8);
          c = Phaser.Math.Between(1, 8);
          const d = a * x + b + c;
          return { equation: `${a}x + ${b} + ${c} = ${d}`, answer: x };
        } else {
          // Type 6: a - bx = c
          b = Phaser.Math.Between(2, 5);
          x = Phaser.Math.Between(1, 6);
          a = Phaser.Math.Between(b * x + 1, b * x + 15);
          c = a - b * x;
          return { equation: `${a} - ${b}x = ${c}`, answer: x };
        }
      }
    };

    class GameScene extends Phaser.Scene {
      private balloons!: Phaser.GameObjects.Group;
      private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
      private scoreText!: Phaser.GameObjects.Text;
      private livesText!: Phaser.GameObjects.Text;
      private spawnTimer!: Phaser.Time.TimerEvent;
      private currentTarget: any = null;

      constructor() {
        super({ key: 'GameScene' });
      }

      preload() {
        // Create gradient balloon graphics
        this.createBalloonGraphics();
      }

      createBalloonGraphics() {
        const colors = [
          { start: 0xff6b35, end: 0xe55527 }, // Orange
          { start: 0x4ecdc4, end: 0x3db8af }, // Teal
          { start: 0xa855f7, end: 0x9333ea }, // Purple
          { start: 0xfcd34d, end: 0xfbbf24 }, // Yellow
          { start: 0xec4899, end: 0xdb2777 }, // Pink
          { start: 0x3b82f6, end: 0x2563eb }, // Blue
        ];

        colors.forEach((color, index) => {
          const graphics = this.add.graphics();
          
          // Draw balloon body
          graphics.fillGradientStyle(color.start, color.start, color.end, color.end, 1);
          graphics.fillEllipse(50, 50, 80, 100);
          
          // Add highlight
          graphics.fillStyle(0xffffff, 0.3);
          graphics.fillEllipse(35, 35, 30, 40);
          
          // Draw string
          graphics.lineStyle(2, 0x666666, 0.8);
          graphics.beginPath();
          graphics.moveTo(50, 100);
          graphics.lineTo(50, 130);
          graphics.strokePath();
          
          graphics.generateTexture(`balloon${index}`, 100, 140);
          graphics.destroy();
        });

        // Create particle texture
        const particle = this.add.graphics();
        particle.fillStyle(0xffffff, 1);
        particle.fillCircle(4, 4, 4);
        particle.generateTexture('particle', 8, 8);
        particle.destroy();
      }

      create() {
        // Background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xe0f6ff, 0xe0f6ff, 1);
        bg.fillRect(0, 0, 800, 600);

        // Add clouds
        this.addClouds();

        // Balloons group
        this.balloons = this.add.group();

        // Particle emitter for popping effect
        this.particles = this.add.particles(0, 0, 'particle', {
          speed: { min: 100, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 1, end: 0 },
          lifespan: 600,
          gravityY: 200,
          emitting: false,
        });

        // UI Text
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
          fontSize: '28px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#333333',
          strokeThickness: 4,
        });

        this.livesText = this.add.text(20, 60, '❤️ ❤️ ❤️', {
          fontSize: '28px',
        });

        // Instructions
        const instructionsBg = this.add.rectangle(400, 550, 760, 80, 0x000000, 0.7);
        instructionsBg.setStrokeStyle(4, 0xff6b35);
        
        this.add.text(400, 530, 'Solve the equation on the balloon and enter the answer below!', {
          fontSize: '20px',
          color: '#ffffff',
          fontFamily: 'DM Sans, sans-serif',
          align: 'center',
        }).setOrigin(0.5);

        this.add.text(400, 560, 'Type your answer and press ENTER to shoot! 🎯', {
          fontSize: '18px',
          color: '#4ecdc4',
          fontFamily: 'DM Sans, sans-serif',
          align: 'center',
        }).setOrigin(0.5);

        // Spawn balloons
        this.spawnTimer = this.time.addEvent({
          delay: 3000 - (gameState.level * 200), // Faster at higher levels
          callback: this.spawnBalloon,
          callbackScope: this,
          loop: true,
        });

        // Spawn initial balloons
        this.time.delayedCall(500, () => this.spawnBalloon());
        this.time.delayedCall(1500, () => this.spawnBalloon());
      }

      addClouds() {
        for (let i = 0; i < 5; i++) {
          const cloud = this.add.graphics();
          cloud.fillStyle(0xffffff, 0.6);
          
          const x = Phaser.Math.Between(50, 750);
          const y = Phaser.Math.Between(50, 200);
          
          cloud.fillCircle(0, 0, 30);
          cloud.fillCircle(25, -5, 35);
          cloud.fillCircle(50, 0, 30);
          cloud.fillCircle(25, 10, 25);
          
          cloud.setPosition(x, y);
          
          // Animate cloud
          this.tweens.add({
            targets: cloud,
            x: x + Phaser.Math.Between(-50, 50),
            duration: Phaser.Math.Between(3000, 6000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        }
      }

      spawnBalloon() {
        const eq = generateEquation(gameState.level);
        const colorIndex = Phaser.Math.Between(0, 5);
        
        const x = Phaser.Math.Between(100, 700);
        const balloon = this.add.sprite(x, 650, `balloon${colorIndex}`);
        balloon.setScale(0.8);
        
        // Add equation text
        const equationText = this.add.text(x, 650, eq.equation, {
          fontSize: '22px',
          color: '#ffffff',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 3,
          align: 'center',
        }).setOrigin(0.5);

        // Store equation data
        balloon.setData('equation', eq.equation);
        balloon.setData('answer', eq.answer);
        balloon.setData('text', equationText);
        balloon.setData('id', Date.now() + Math.random());

        // Add to group
        this.balloons.add(balloon);
        gameState.balloons.push(balloon);

        // Animate upward
        this.tweens.add({
          targets: [balloon, equationText],
          y: -100,
          duration: 8000 - (gameState.level * 500), // Faster at higher levels
          ease: 'Linear',
          onUpdate: () => {
            equationText.setPosition(balloon.x, balloon.y);
          },
          onComplete: () => {
            this.balloonEscaped(balloon);
          },
        });

        // Subtle floating animation
        this.tweens.add({
          targets: balloon,
          x: x + Phaser.Math.Between(-30, 30),
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        // Auto-select first balloon as target
        if (!this.currentTarget) {
          this.selectTarget(balloon);
        }
      }

      selectTarget(balloon: any) {
        // Deselect previous
        if (this.currentTarget) {
          this.currentTarget.clearTint();
        }

        this.currentTarget = balloon;
        balloon.setTint(0xffff00); // Yellow tint for target
        
        setTargetBalloon(balloon.getData('equation'));
      }

      balloonEscaped(balloon: any) {
        if (!balloon.active) return;

        const text = balloon.getData('text');
        text?.destroy();
        balloon.destroy();

        // Remove from array
        const index = gameState.balloons.indexOf(balloon);
        if (index > -1) gameState.balloons.splice(index, 1);

        // If this was the target, select next
        if (this.currentTarget === balloon) {
          this.currentTarget = null;
          if (gameState.balloons.length > 0) {
            this.selectTarget(gameState.balloons[0]);
          } else {
            setTargetBalloon(null);
          }
        }

        // Lose life
        gameState.lives--;
        setLives(gameState.lives);
        this.updateLivesDisplay();

        // Camera shake
        this.cameras.main.shake(200, 0.01);

        if (gameState.lives <= 0) {
          this.gameOver();
        }
      }

      checkAnswer(answer: string) {
        if (!this.currentTarget || !this.currentTarget.active) return;

        const correctAnswer = this.currentTarget.getData('answer');
        const userAnswer = parseInt(answer);

        if (userAnswer === correctAnswer) {
          this.popBalloon(this.currentTarget, true);
        } else {
          this.wrongAnswer();
        }
      }

      popBalloon(balloon: any, correct: boolean) {
        if (!balloon.active) return;

        const text = balloon.getData('text');
        
        // Particle explosion
        this.particles.setPosition(balloon.x, balloon.y);
        
        if (correct) {
          this.particles.setParticleTint(0x4ecdc4);
          this.particles.explode(20);
          
          // Score
          gameState.score += 10 + (gameState.level * 5);
          setScore(gameState.score);
          this.scoreText.setText(`Score: ${gameState.score}`);

          // Show +points
          const points = this.add.text(balloon.x, balloon.y, `+${10 + (gameState.level * 5)}`, {
            fontSize: '32px',
            color: '#4ecdc4',
            fontFamily: 'Fredoka, sans-serif',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 4,
          }).setOrigin(0.5);

          this.tweens.add({
            targets: points,
            y: balloon.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => points.destroy(),
          });
        } else {
          this.particles.setParticleTint(0xff0000);
          this.particles.explode(15);
        }

        // Destroy balloon
        text?.destroy();
        balloon.destroy();

        // Remove from array
        const index = gameState.balloons.indexOf(balloon);
        if (index > -1) gameState.balloons.splice(index, 1);

        // Select next balloon
        this.currentTarget = null;
        if (gameState.balloons.length > 0) {
          this.selectTarget(gameState.balloons[0]);
        } else {
          setTargetBalloon(null);
        }
      }

      wrongAnswer() {
        // Camera shake
        this.cameras.main.shake(150, 0.005);
        
        // Flash red
        const overlay = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.3);
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 300,
          onComplete: () => overlay.destroy(),
        });
      }

      updateLivesDisplay() {
        const hearts = '❤️ '.repeat(Math.max(0, gameState.lives));
        const emptyHearts = '🖤 '.repeat(Math.max(0, 3 - gameState.lives));
        this.livesText.setText(hearts + emptyHearts);
      }

      gameOver() {
        this.spawnTimer.destroy();
        this.balloons.clear(true, true);
        gameState.balloons = [];

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
        const gameOverText = this.add.text(400, 250, 'Game Over!', {
          fontSize: '64px',
          color: '#ff6b35',
          fontFamily: 'Fredoka, sans-serif',
          fontStyle: 'bold',
          stroke: '#ffffff',
          strokeThickness: 6,
        }).setOrigin(0.5);

        const finalScore = this.add.text(400, 330, `Final Score: ${gameState.score}`, {
          fontSize: '32px',
          color: '#ffffff',
          fontFamily: 'DM Sans, sans-serif',
        }).setOrigin(0.5);

        // Calculate stars (1-3 based on score)
        const stars = gameState.score >= 100 ? 3 : gameState.score >= 50 ? 2 : 1;
        
        this.time.delayedCall(2000, () => {
          onComplete(gameState.score, stars);
        });
      }

      update() {
        // Game loop
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#87ceeb',
      scene: GameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    // Expose method to check answer from React
    (window as any).checkAnswer = (answer: string) => {
      const scene = game.scene.getScene('GameScene') as any;
      if (scene && scene.checkAnswer) {
        scene.checkAnswer(answer);
      }
    };

    return () => {
      game.destroy(true);
      delete (window as any).checkAnswer;
    };
  }, [level, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAnswer.trim()) {
      (window as any).checkAnswer?.(currentAnswer);
      setCurrentAnswer('');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Game Canvas */}
      <div 
        ref={gameRef} 
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-primary"
        style={{ maxWidth: '800px', width: '100%' }}
      />

      {/* Input Section */}
      <div className="mt-6 w-full max-w-2xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-secondary">
          <div className="mb-4">
            <div className="text-sm font-display font-semibold text-gray-600 mb-2">
              Current Target:
            </div>
            <div className="bg-gradient-to-r from-accent-yellow/20 to-accent-pink/20 rounded-xl p-4 text-center">
              {targetBalloon ? (
                <div className="text-3xl font-display font-bold text-gray-800">
                  {targetBalloon}
                </div>
              ) : (
                <div className="text-lg font-body text-gray-500">
                  No balloon selected
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Enter value of x..."
                className="w-full px-6 py-4 rounded-xl border-4 border-primary/30 focus:border-primary outline-none font-display text-2xl text-center font-bold"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-8 py-4 rounded-xl text-white font-display font-bold text-xl shadow-lg"
            >
              Shoot! 🎯
            </button>
          </form>

          <div className="mt-4 flex justify-between items-center text-sm font-body text-gray-600">
            <div>Press ENTER to shoot</div>
            <div>Level {level}</div>
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="mt-4 flex gap-6">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-display font-bold shadow-lg">
          Score: {score}
        </div>
        <div className="bg-gradient-to-r from-accent-pink to-accent-purple text-white px-6 py-3 rounded-xl font-display font-bold shadow-lg">
          Lives: {'❤️'.repeat(lives)}
        </div>
      </div>
    </div>
  );
}