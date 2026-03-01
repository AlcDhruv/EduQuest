'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the game to avoid SSR issues with Phaser
const LinearEquationGame = dynamic(
  () => import('@/components/games/LinearEquationGame'),
  { ssr: false }
);

const PizzaPartyGame = dynamic(
  () => import('@/components/games/PizzaPartyGame'),
  { ssr: false }
);

const PrimeTreasureGame = dynamic(
  () => import('@/components/games/PrimeTreasureGame'),
  { ssr: false }
);

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const subject = params.subject as string;
  const topic = params.topic as string;
  const section = params.section as string;
  const level = parseInt(searchParams.get('level') || '1');

  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [stars, setStars] = useState(0);

  const handleGameComplete = (score: number, earnedStars: number) => {
    setFinalScore(score);
    setStars(earnedStars);
    setGameComplete(true);
  };

  const handleExit = () => {
    setGameStarted(false);
    setGameComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Game Header */}
      <header className="bg-black/50 border-b-2 border-primary">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/subject/${subject}`}>
                <button className="text-white hover:text-primary transition-colors font-display font-semibold">
                  ← Exit Game
                </button>
              </Link>
              <div className="text-white">
                <div className="font-display font-bold capitalize text-lg">
                  {subject} - {topic.replace(/-/g, ' ')}
                </div>
                <div className="text-sm text-gray-400 font-body">
                  Section {parseInt(section) + 1} - Level {level}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-accent-yellow to-accent-pink px-4 py-2 rounded-xl">
              <div className="text-white font-display font-bold">
                🎯 Balloon Shooter
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!gameStarted && !gameComplete && (
  // Start Screen
  <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Dynamic Header based on topic */}
      {topic === 'linear-equations' && (
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
          <div className="text-7xl mb-4">🎈</div>
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Balloon Equation Shooter!
          </h1>
          <p className="text-xl text-white/90 font-body">
            Pop balloons by solving linear equations
          </p>
        </div>
      )}

      {topic === 'fractions' && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-center">
          <div className="text-7xl mb-4">🍕</div>
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Pizza Party!
          </h1>
          <p className="text-xl text-white/90 font-body">
            Match fractions by selecting pizza slices
          </p>
        </div>
      )}

      {topic === 'prime-numbers' && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-center">
          <div className="text-7xl mb-4">💎</div>
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Prime Treasure Hunt!
          </h1>
          <p className="text-xl text-white/90 font-body">
            Find treasure by clicking only prime numbers
          </p>
        </div>
      )}

      <div className="p-8">
        {/* How to Play - Dynamic */}
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold mb-6 text-gray-800">
            How to Play 🎮
          </h2>
          
          {topic === 'linear-equations' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="text-4xl mb-3">🎈</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Balloons Rise
                </h3>
                <p className="font-body text-gray-600">
                  Balloons with equations float upward. Don't let them escape!
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="text-4xl mb-3">🧮</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Solve Equation
                </h3>
                <p className="font-body text-gray-600">
                  Find the value of 'x' that makes the equation true.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Shoot to Pop
                </h3>
                <p className="font-body text-gray-600">
                  Enter the answer and press ENTER to pop the balloon!
                </p>
              </div>
            </div>
          )}

          {topic === 'fractions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <div className="text-4xl mb-3">🍕</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Pizzas Fall
                </h3>
                <p className="font-body text-gray-600">
                  Pizzas with fractions fall from above. Catch them in time!
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                <div className="text-4xl mb-3">✂️</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Select Slices
                </h3>
                <p className="font-body text-gray-600">
                  Click the correct number of slices to match the fraction.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Check Answer
                </h3>
                <p className="font-body text-gray-600">
                  Press the check button to see if you got it right!
                </p>
              </div>
            </div>
          )}

          {topic === 'prime-numbers' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Chests Float
                </h3>
                <p className="font-body text-gray-600">
                  Treasure chests with numbers float down underwater.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Find Primes
                </h3>
                <p className="font-body text-gray-600">
                  Click only the chests with prime numbers inside!
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="text-4xl mb-3">🔥</div>
                <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                  Build Combos
                </h3>
                <p className="font-body text-gray-600">
                  Click primes in a row to build combos and multipliers!
                </p>
              </div>
            </div>
          )}
        </div>

                {/* Level Info */}
                <div className="bg-gradient-to-r from-accent-yellow/20 to-accent-pink/20 rounded-2xl p-6 mb-8 border-2 border-accent-yellow/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-gray-800 mb-2">
                        Level {level} Difficulty
                      </h3>
                      <p className="font-body text-gray-700">
                        {topic === 'linear-equations' && (
                          <>
                            {level === 1 && "Simple equations: x = a, x + a = b, a + x = b, x - a = b"}
                            {level === 2 && "Mixed operations: x ± a = b, a - x = b, x + a + b = c"}
                            {level >= 3 && "With multiplication: ax = b, ax ± b = c, a + bx = c, multi-step"}
                          </>
                        )}
                        {topic === 'fractions' && (
                          <>
                            {level === 1 && "Simple fractions: halves, thirds, quarters"}
                            {level === 2 && "More variety: up to eighths"}
                            {level >= 3 && "Complex fractions: up to twelfths"}
                          </>
                        )}
                        {topic === 'prime-numbers' && (
                          <>
                            {level === 1 && "Numbers 1-30: Basic primes"}
                            {level === 2 && "Numbers 1-60: More challenging"}
                            {level >= 3 && "Numbers 1-100: Advanced"}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scoring */}
                <div className="mb-8">
                  <h3 className="font-display font-bold text-2xl text-gray-800 mb-4">
                    Scoring 🏆
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-gray-50 rounded-xl p-4">
                      <div className="text-3xl mb-2">⭐</div>
                      <div className="font-display font-bold text-primary">50+ points</div>
                      <div className="text-sm text-gray-600 font-body">1 Star</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-xl p-4">
                      <div className="text-3xl mb-2">⭐⭐</div>
                      <div className="font-display font-bold text-secondary">100+ points</div>
                      <div className="text-sm text-gray-600 font-body">2 Stars</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-xl p-4">
                      <div className="text-3xl mb-2">⭐⭐⭐</div>
                      <div className="font-display font-bold text-accent-purple">150+ points</div>
                      <div className="text-sm text-gray-600 font-body">3 Stars</div>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => setGameStarted(true)}
                  className="w-full btn-primary py-6 rounded-2xl text-white font-display font-bold text-2xl shadow-xl"
                >
                  Start Game! 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {gameStarted && !gameComplete && (
          <div className="max-w-5xl mx-auto">
            {topic === 'linear-equations' && (
              <LinearEquationGame
                level={level}
                onComplete={handleGameComplete}
                onExit={handleExit}
              />
            )}
            
            {topic === 'fractions' && (
              <PizzaPartyGame
                level={level}
                onComplete={handleGameComplete}
                onExit={handleExit}
              />
            )}
            
            {topic === 'prime-numbers' && (
              <PrimeTreasureGame
                level={level}
                onComplete={handleGameComplete}
                onExit={handleExit}
              />
            )}
          </div>
        )}

        {gameComplete && (
          // Complete Screen
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-accent-purple to-accent-pink p-12 text-center">
                <div className="text-8xl mb-6 animate-bounce">
                  {stars === 3 ? "🏆" : stars === 2 ? "🎉" : "👍"}
                </div>
                <h1 className="text-6xl font-display font-bold text-white mb-4">
                  {stars === 3 ? "Perfect!" : stars === 2 ? "Great Job!" : "Good Effort!"}
                </h1>
                <div className="text-4xl mb-4">
                  {"⭐".repeat(stars)}
                </div>
                <p className="text-2xl text-white/90 font-body">
                  Final Score: {finalScore}
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 text-center border-2 border-primary/30">
                    <div className="text-4xl mb-2">🎯</div>
                    <div className="text-3xl font-display font-bold text-primary mb-1">
                      {finalScore}
                    </div>
                    <div className="text-sm text-gray-600 font-body">Points Earned</div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-2xl p-6 text-center border-2 border-secondary/30">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-3xl font-display font-bold text-secondary mb-1">
                      {stars}
                    </div>
                    <div className="text-sm text-gray-600 font-body">Stars</div>
                  </div>

                  <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-yellow/20 rounded-2xl p-6 text-center border-2 border-accent-yellow/30">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="text-3xl font-display font-bold text-accent-yellow mb-1">
                      Level {level}
                    </div>
                    <div className="text-sm text-gray-600 font-body">Completed</div>
                  </div>
                </div>

                {stars >= 2 && (
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🔓</div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-gray-800 mb-1">
                          Next Level Unlocked!
                        </h3>
                        <p className="font-body text-gray-600">
                          You've earned enough stars to advance to Level {level + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setGameComplete(false);
                      setGameStarted(true);
                      setFinalScore(0);
                      setStars(0);
                    }}
                    className="flex-1 btn-primary py-4 rounded-xl text-white font-display font-bold text-lg shadow-lg"
                  >
                    Play Again 🔄
                  </button>
                  
                  {stars >= 2 && (
                    <Link href={`/game/${subject}/${topic}/${section}?level=${level + 1}`} className="flex-1">
                      <button className="w-full bg-gradient-to-r from-secondary to-accent-blue text-white py-4 rounded-xl font-display font-bold text-lg shadow-lg hover:scale-105 transition-transform">
                        Next Level ➡️
                      </button>
                    </Link>
                  )}
                  
                  <Link href={`/subject/${subject}`} className="flex-1">
                    <button className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-display font-bold text-lg hover:border-primary hover:text-primary transition-colors">
                      Back to Topics
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}