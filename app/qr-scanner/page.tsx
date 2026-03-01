'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QRScannerPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const startScan = () => {
    setIsScanning(true);
    
    // Simulate scanning after 2 seconds
    setTimeout(() => {
      // For demo, we'll simulate a scanned URL
      const demoUrl = `${window.location.origin}/game/math/linear-equations/0?level=1`;
      setScannedData(demoUrl);
      setIsScanning(false);
      
      // Auto-redirect after showing success
      setTimeout(() => {
        router.push('/subject/math');
      }, 2000);
    }, 2000);
  };

  const manualEntry = () => {
    // Allow manual code entry
    const code = prompt('Enter the code from your textbook:');
    if (code) {
      router.push(`/subject/math`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b-4 border-secondary shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-xl transform -rotate-12">📱</span>
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                QR Scanner
              </h1>
            </Link>
            
            <Link href="/">
              <button className="px-4 py-2 rounded-xl border-2 border-gray-300 hover:border-secondary font-display font-medium transition-colors">
                ← Back
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Instructions */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6 animate-bounce-slow">📷</div>
            <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Scan Your Textbook
            </h1>
            <p className="text-xl text-gray-600 font-body">
              Point your camera at the QR code in your NCERT textbook to start the game!
            </p>
          </div>

          {/* Scanner Area */}
          <div className="bg-white rounded-3xl border-4 border-gray-200 shadow-xl p-8 mb-8">
            {!isScanning && !scannedData && (
              <div>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 flex items-center justify-center mb-6 border-4 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-gray-600 font-body mb-4">Ready to scan</p>
                    <button
                      onClick={startScan}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-display font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="relative">
                <div className="bg-black rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
                  {/* Simulated camera view */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-4 border-secondary rounded-2xl relative">
                        <div className="scan-line"></div>
                        {/* Corner indicators */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-lg"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-white font-display font-bold mb-2">Scanning...</div>
                    <div className="text-secondary font-body text-sm">Align QR code within the frame</div>
                  </div>
                </div>
              </div>
            )}

            {scannedData && (
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl h-96 flex items-center justify-center mb-6">
                  <div>
                    <div className="text-8xl mb-4 animate-bounce">✅</div>
                    <h2 className="text-3xl font-display font-bold text-green-700 mb-2">
                      Scan Successful!
                    </h2>
                    <p className="text-green-600 font-body mb-4">
                      Redirecting to your game...
                    </p>
                    <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alternative Options */}
          {!isScanning && !scannedData && (
            <div>
              <div className="text-center mb-4">
                <span className="text-gray-500 font-body">or</span>
              </div>
              
              <button
                onClick={manualEntry}
                className="w-full border-2 border-primary text-primary py-4 rounded-2xl font-display font-semibold text-lg hover:bg-primary hover:text-white transition-colors mb-4"
              >
                Enter Code Manually
              </button>

              <Link href="/" className="block">
                <button className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-2xl font-display font-semibold text-lg hover:border-gray-400 transition-colors">
                  Browse All Subjects
                </button>
              </Link>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-2xl p-6 border-2 border-accent-blue/20">
            <h3 className="text-xl font-display font-bold mb-3 text-gray-800">
              📖 Where to Find QR Codes?
            </h3>
            <ul className="space-y-2 font-body text-gray-700">
              <li>• Look at the end of each exercise section in your NCERT textbook</li>
              <li>• QR codes are typically placed after the last question</li>
              <li>• Each code links to games for that specific topic</li>
              <li>• No QR code? Use the "Browse All Subjects" option</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
