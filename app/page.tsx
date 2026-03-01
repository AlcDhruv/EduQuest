'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function WelcomePage() {
  const { user, loading } = useAuth();

  // If user is logged in, show them a simple redirect button instead
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-4">You're already logged in!</h2>
          <Link href="/home">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-display font-semibold">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    // ... rest of your welcome page JSX (no changes)
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <div className="text-center space-y-12">
          {/* Logo/Icon */}
          <div className="inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center transform rotate-12 shadow-2xl mb-4">
              <span className="text-5xl transform -rotate-12">🎮</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-display font-bold text-gray-900">
              EduQuest
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-body max-w-2xl mx-auto">
              Transform learning into an adventure. Play games, master topics, and level up your knowledge.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login">
              <button className="w-64 bg-gray-900 text-white px-8 py-4 rounded-full font-display font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-64 border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-display font-semibold text-lg hover:bg-gray-50 transition-all hover:scale-105">
                Create Account
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-display font-bold text-lg text-gray-900">
                Interactive Games
              </h3>
              <p className="text-sm text-gray-600 font-body">
                Learn through engaging gameplay designed for middle school students
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-display font-bold text-lg text-gray-900">
                Curriculum Aligned
              </h3>
              <p className="text-sm text-gray-600 font-body">
                Perfectly matched with NCERT textbook chapters and exercises
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-display font-bold text-lg text-gray-900">
                Track Progress
              </h3>
              <p className="text-sm text-gray-600 font-body">
                Earn stars, unlock levels, and see your learning journey unfold
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-400 font-body">
          Built with ❤️ for learners everywhere
        </p>
      </div>
    </div>
  );
}
