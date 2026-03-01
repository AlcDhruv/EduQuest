'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.id as string;

  const subjectData: any = {
    math: {
      name: 'Mathematics',
      icon: '🔢',
      color: 'from-blue-500 to-purple-500',
      topics: [
        {
          id: 'linear-equations',
          name: 'Linear Equations',
          chapter: 'Chapter 4',
          sections: [
            { name: 'Introduction to Variables', levels: 3, completed: 3 },
            { name: 'Solving Basic Equations', levels: 4, completed: 2 },
            { name: 'Word Problems', levels: 5, completed: 0 },
          ]
        },
        {
          id: 'geometry',
          name: 'Geometry Basics',
          chapter: 'Chapter 6',
          sections: [
            { name: 'Angles and Lines', levels: 4, completed: 4 },
            { name: 'Triangles', levels: 5, completed: 1 },
            { name: 'Quadrilaterals', levels: 4, completed: 0 },
          ]
        },
        {
          id: 'fractions',
          name: 'Fractions & Decimals',
          chapter: 'Chapter 2',
          sections: [
            { name: 'Understanding Fractions', levels: 3, completed: 0 },
            { name: 'Comparing Fractions', levels: 3, completed: 0 },
            { name: 'Operations with Fractions', levels: 3, completed: 0 },
          ]
        },
        {
          id: 'prime-numbers',
          name: 'Prime Numbers',
          chapter: 'Chapter 3',
          sections: [
            { name: 'Identifying Primes', levels: 3, completed: 0 },
            { name: 'Prime Factorization', levels: 3, completed: 0 },
          ]
        }
      ]
    },
    science: {
      name: 'Science',
      icon: '🔬',
      color: 'from-green-500 to-teal-500',
      topics: [
        {
          id: 'cell-structure',
          name: 'Cell Structure',
          chapter: 'Chapter 8',
          sections: [
            { name: 'Parts of a Cell', levels: 3, completed: 2 },
            { name: 'Plant vs Animal Cells', levels: 4, completed: 1 },
            { name: 'Cell Functions', levels: 3, completed: 0 },
          ]
        },
        {
          id: 'forces',
          name: 'Forces and Motion',
          chapter: 'Chapter 11',
          sections: [
            { name: 'Types of Forces', levels: 4, completed: 0 },
            { name: "Newton's Laws", levels: 5, completed: 0 },
            { name: 'Friction', levels: 3, completed: 0 },
          ]
        },
      ]
    },
  };

  const subject = subjectData[subjectId] || subjectData.math;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b-4 border-primary shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-xl transform -rotate-12">🎮</span>
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduQuest
              </h1>
            </Link>
            
            <Link href="/">
              <button className="px-4 py-2 rounded-xl border-2 border-gray-300 hover:border-primary font-display font-medium transition-colors">
                ← Back to Home
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Subject Header */}
        <div className="mb-12 text-center">
          <div className="text-8xl mb-4 animate-bounce-slow">{subject.icon}</div>
          <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {subject.name}
          </h1>
          <p className="text-xl text-gray-600 font-body">
            Choose a topic to start playing and learning!
          </p>
        </div>

        {/* Topics */}
        <div className="space-y-8">
          {subject.topics.map((topic: any, topicIndex: number) => (
            <div
              key={topic.id}
              className="bg-white rounded-3xl border-4 border-gray-200 shadow-xl p-8 card-hover"
              style={{ animationDelay: `${topicIndex * 0.1}s` }}
            >
              {/* Topic Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm font-display font-semibold text-primary mb-2">
                    {topic.chapter}
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                    {topic.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-body">
                      {topic.sections.length} Sections
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600 font-body">
                      {topic.sections.reduce((acc: number, s: any) => acc + s.levels, 0)} Total Levels
                    </span>
                  </div>
                </div>
                
                {/* Overall Progress */}
                <div className="text-right">
                  <div className="text-3xl font-display font-bold text-secondary mb-1">
                    {Math.round(
                      (topic.sections.reduce((acc: number, s: any) => acc + s.completed, 0) /
                        topic.sections.reduce((acc: number, s: any) => acc + s.levels, 0)) *
                        100
                    )}%
                  </div>
                  <div className="text-sm text-gray-500 font-body">Complete</div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {topic.sections.map((section: any, sectionIndex: number) => {
                  const progress = (section.completed / section.levels) * 100;
                  const isCompleted = section.completed === section.levels;
                  const isLocked = sectionIndex > 0 && topic.sections[sectionIndex - 1].completed === 0;

                  return (
                    <Link
                      href={isLocked ? '#' : `/game/${subjectId}/${topic.id}/${sectionIndex}`}
                      key={sectionIndex}
                      className={`block ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`bg-gradient-to-r ${subject.color} p-1 rounded-2xl ${!isLocked && 'card-hover'}`}>
                        <div className="bg-white rounded-xl p-6 relative overflow-hidden">
                          {/* Background Pattern */}
                          {isCompleted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-yellow/10 to-accent-pink/10"></div>
                          )}
                          
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-display font-bold text-gray-800">
                                  {section.name}
                                </h3>
                                {isCompleted && (
                                  <span className="text-2xl">✅</span>
                                )}
                                {isLocked && (
                                  <span className="text-2xl">🔒</span>
                                )}
                              </div>
                              
                              {/* Level Indicators */}
                              <div className="flex items-center gap-2 mb-3">
                                {[...Array(section.levels)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                                      i < section.completed
                                        ? 'bg-gradient-to-br from-accent-yellow to-accent-pink text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    {i + 1}
                                  </div>
                                ))}
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {!isLocked && (
                              <div className="ml-6">
                                <button className="btn-primary px-6 py-3 rounded-xl text-white font-display font-semibold">
                                  {section.completed > 0 ? 'Continue' : 'Start'} ▶
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Generate QR Code CTA */}
        <div className="mt-12 bg-gradient-to-r from-accent-purple to-accent-pink rounded-3xl p-8 text-center shadow-2xl border-4 border-white">
          <h3 className="text-3xl font-display font-bold text-white mb-4">
            Teacher or Parent? 👨‍🏫
          </h3>
          <p className="text-lg text-white/90 font-body mb-6">
            Generate QR codes for your textbooks to help students access these games instantly!
          </p>
          <Link href="/admin">
            <button className="bg-white text-accent-purple px-8 py-4 rounded-2xl font-display font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              Go to Admin Panel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}