'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    subject: 'math',
    topic: '',
    section: '',
    level: 1,
  });

  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrHistory, setQrHistory] = useState<any[]>([]);

  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'social', name: 'Social Studies' },
  ];

  const generateQRCode = () => {
    // Construct the URL that the QR code will point to
    const gameUrl = `${window.location.origin}/game/${formData.subject}/${formData.topic}/${formData.section}?level=${formData.level}`;
    
    // In a real app, you'd use the qrcode library here
    // For demo purposes, we'll use a QR code API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(gameUrl)}`;
    
    setGeneratedQR(qrCodeUrl);
    
    // Add to history
    const newQR = {
      id: Date.now(),
      subject: formData.subject,
      topic: formData.topic,
      section: formData.section,
      level: formData.level,
      url: gameUrl,
      qrUrl: qrCodeUrl,
      date: new Date().toLocaleDateString(),
    };
    
    setQrHistory([newQR, ...qrHistory]);
  };

  const downloadQR = (qrUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = filename;
    link.click();
  };

  const downloadAllQRs = () => {
    qrHistory.forEach((qr, index) => {
      setTimeout(() => {
        downloadQR(qr.qrUrl, `qr-${qr.subject}-${qr.topic}-${index}.png`);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b-4 border-accent-purple shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-xl transform -rotate-12">⚙️</span>
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </Link>
            
            <Link href="/">
              <button className="px-4 py-2 rounded-xl border-2 border-gray-300 hover:border-accent-purple font-display font-medium transition-colors">
                ← Back to Home
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Generator Form */}
          <div className="bg-white rounded-3xl border-4 border-gray-200 shadow-xl p-8">
            <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
              Generate QR Code
            </h2>
            <p className="text-gray-600 font-body mb-8">
              Create QR codes to place in textbooks at the end of each section
            </p>

            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-accent-purple outline-none font-body"
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-2">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Linear Equations"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-accent-purple outline-none font-body"
                />
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-2">
                  Section Name
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., Introduction to Variables"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-accent-purple outline-none font-body"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-2">
                  Starting Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-accent-purple outline-none font-body"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateQRCode}
                disabled={!formData.topic || !formData.section}
                className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white py-4 rounded-xl font-display font-bold text-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Generate QR Code 🎯
              </button>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="bg-white rounded-3xl border-4 border-gray-200 shadow-xl p-8">
            <h2 className="text-3xl font-display font-bold mb-2 text-gray-800">
              Preview
            </h2>
            <p className="text-gray-600 font-body mb-8">
              Your generated QR code will appear here
            </p>

            {generatedQR ? (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-2xl p-8 text-center">
                  <img
                    src={generatedQR}
                    alt="Generated QR Code"
                    className="mx-auto shadow-2xl rounded-xl border-4 border-white"
                  />
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-display font-semibold text-gray-700">Subject:</span>
                    <span className="font-body text-gray-600 capitalize">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-display font-semibold text-gray-700">Topic:</span>
                    <span className="font-body text-gray-600">{formData.topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-display font-semibold text-gray-700">Section:</span>
                    <span className="font-body text-gray-600">{formData.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-display font-semibold text-gray-700">Level:</span>
                    <span className="font-body text-gray-600">{formData.level}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => downloadQR(generatedQR, `qr-${formData.subject}-${formData.topic}.png`)}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-display font-semibold shadow-lg hover:scale-105 transition-transform"
                  >
                    Download QR
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(qrHistory[0]?.url || '')}
                    className="flex-1 border-2 border-accent-purple text-accent-purple py-3 rounded-xl font-display font-semibold hover:bg-accent-purple hover:text-white transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-gray-500 font-body">
                    Fill the form and click Generate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR History */}
        {qrHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl border-4 border-gray-200 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-gray-800">
                  Generated QR Codes
                </h2>
                <p className="text-gray-600 font-body">
                  {qrHistory.length} QR code{qrHistory.length !== 1 ? 's' : ''} generated
                </p>
              </div>
              <button
                onClick={downloadAllQRs}
                className="bg-gradient-to-r from-accent-purple to-accent-pink text-white px-6 py-3 rounded-xl font-display font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrHistory.map((qr) => (
                <div key={qr.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 card-hover">
                  <img
                    src={qr.qrUrl}
                    alt="QR Code"
                    className="w-full mb-4 rounded-xl shadow-lg"
                  />
                  <div className="space-y-2 mb-4">
                    <div className="font-display font-bold text-gray-800 capitalize">
                      {qr.subject} - {qr.topic}
                    </div>
                    <div className="text-sm text-gray-600 font-body">
                      {qr.section}
                    </div>
                    <div className="text-xs text-gray-500 font-body">
                      Generated: {qr.date}
                    </div>
                  </div>
                  <button
                    onClick={() => downloadQR(qr.qrUrl, `qr-${qr.subject}-${qr.topic}-${qr.id}.png`)}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-display font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-accent-yellow/20 to-accent-pink/20 rounded-3xl p-8 border-4 border-accent-yellow/30">
          <h3 className="text-2xl font-display font-bold mb-4 text-gray-800">
            💡 How to Use QR Codes in Textbooks
          </h3>
          <div className="space-y-3 font-body text-gray-700">
            <p>1. Generate QR codes for each section/exercise in your NCERT textbook</p>
            <p>2. Print and paste them at the end of relevant sections</p>
            <p>3. Students scan the code with their phones to access the game instantly</p>
            <p>4. Games are automatically matched to what they just learned!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
