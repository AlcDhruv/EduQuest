'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const subjects = [
    { 
      id: 'math', 
      name: 'Mathematics', 
      icon: '🔢', 
      color: 'from-blue-500 to-purple-500',
      topics: 12,
      levels: 45
    },
    { 
      id: 'science', 
      name: 'Science', 
      icon: '🔬', 
      color: 'from-green-500 to-teal-500',
      topics: 10,
      levels: 38
    },
    { 
      id: 'english', 
      name: 'English', 
      icon: '📚', 
      color: 'from-orange-500 to-red-500',
      topics: 8,
      levels: 32
    },
    { 
      id: 'social', 
      name: 'Social Studies', 
      icon: '🌍', 
      color: 'from-yellow-500 to-orange-500',
      topics: 9,
      levels: 35
    },
  ];

  const recentGames = [
    { topic: 'Linear Equations', level: 3, progress: 75 },
    { topic: 'Cell Structure', level: 2, progress: 50 },
    { topic: 'Grammar Basics', level: 4, progress: 90 },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b-4 border-primary shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-2xl transform -rotate-12">🎮</span>
              </div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduQuest
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/qr-scanner" className="font-display font-medium text-gray-700 hover:text-primary transition-colors">
                Scan QR
              </Link>
              <Link href="/admin" className="font-display font-medium text-gray-700 hover:text-primary transition-colors">
                Admin
              </Link>
              <button 
                onClick={handleLogout}
                className="font-display font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Logout
              </button>
              <button className="btn-primary px-6 py-2 rounded-full text-white font-display font-semibold shadow-lg">
                My Progress
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Learn <span className="bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent">Through</span> Play! 🚀
          </h2>
          <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto mb-8">
            Turn your textbook into an adventure! Scan QR codes in your NCERT books and unlock exciting games for every topic.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a topic or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-4 border-primary/20 focus:border-primary outline-none font-body text-lg shadow-lg bg-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-6 py-2 rounded-xl text-white font-display font-semibold">
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl border-4 border-accent-yellow/30 card-hover">
              <div className="text-3xl font-display font-bold text-primary">500+</div>
              <div className="text-sm text-gray-600 font-body">Games</div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl border-4 border-accent-purple/30 card-hover">
              <div className="text-3xl font-display font-bold text-secondary">4</div>
              <div className="text-sm text-gray-600 font-body">Subjects</div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl border-4 border-accent-pink/30 card-hover">
              <div className="text-3xl font-display font-bold text-accent-purple">10K+</div>
              <div className="text-sm text-gray-600 font-body">Students</div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-display font-bold mb-8 text-gray-800">Choose Your Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <Link
                href={`/subject/${subject.id}`}
                key={subject.id}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-hover bg-white rounded-3xl p-8 border-4 border-gray-200 group-hover:border-primary shadow-xl relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  
                  {/* Icon */}
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </div>
                  
                  {/* Content */}
                  <h4 className="text-2xl font-display font-bold mb-2 text-gray-800">
                    {subject.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 font-body mb-4">
                    <span>{subject.topics} Topics</span>
                    <span>•</span>
                    <span>{subject.levels} Levels</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${subject.color}`}
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 font-body">65% Complete</p>
                  
                  {/* Play Arrow */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white transform group-hover:scale-125 transition-transform shadow-lg">
                    ▶
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-16">
          <h3 className="text-3xl font-display font-bold mb-8 text-gray-800">Continue Learning</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentGames.map((game, index) => (
              <div
                key={index}
                className="card-hover bg-white rounded-2xl p-6 border-4 border-gray-200 shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-display font-bold text-gray-800 mb-1">
                      {game.topic}
                    </h4>
                    <p className="text-sm text-gray-600 font-body">Level {game.level}</p>
                  </div>
                  <div className="level-badge w-10 h-10 bg-gradient-to-br from-accent-yellow to-accent-pink rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {game.level}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm font-body text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-bold">{game.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${game.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="w-full btn-primary py-3 rounded-xl text-white font-display font-semibold mt-2">
                  Resume Game
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* QR Scanner CTA */}
        <div className="bg-gradient-to-r from-primary via-secondary to-accent-purple rounded-3xl p-12 text-center shadow-2xl border-4 border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-4xl font-display font-bold text-white mb-4">
              Got Your Textbook?
            </h3>
            <p className="text-xl text-white/90 font-body mb-8 max-w-2xl mx-auto">
              Scan the QR code at the end of each chapter section to unlock the perfect game for what you're learning!
            </p>
            <Link href="/qr-scanner">
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-display font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                Open QR Scanner
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-display font-bold text-2xl mb-4">EduQuest</h4>
              <p className="text-gray-400 font-body">Making learning fun, one game at a time.</p>
            </div>
            <div>
              <h5 className="font-display font-semibold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-2 font-body text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-display font-semibold text-lg mb-4">Contact</h5>
              <p className="text-gray-400 font-body">
                Questions? Feedback?<br />
                We'd love to hear from you!
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 font-body">
            <p>&copy; 2026 EduQuest. Built for middle school learners with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
