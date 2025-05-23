"use client";

import { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface ScanResult {
  status: 'safe' | 'phishing' | null;
  confidence: number;
  explanation: string;
  suggestion: string;
}

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!url) return;
    
    setIsScanning(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isMalicious = url.includes('phish') || 
                         url.includes('suspicious') || 
                         Math.random() > 0.7;
      
      setScanResult({
        status: isMalicious ? 'phishing' : 'safe',
        confidence: isMalicious ? 
          Math.floor(Math.random() * 20) + 80 : 
          Math.floor(Math.random() * 30) + 70,
        explanation: isMalicious ?
          'This URL contains suspicious patterns commonly found in phishing attempts. The domain was recently registered and mimics a legitimate service.' :
          'This URL appears to be legitimate and has no known phishing indicators. The domain has a good reputation and secure connection.',
        suggestion: isMalicious ?
          'Do not click this link! Avoid entering any personal information if you have already visited this site.' :
          'This link appears safe to visit, but always remain cautious about sharing sensitive information.'
      });
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (scanResult) setScanResult(null);
  };

  return (
    <section id="scanner" className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Check if a URL is <span className="text-cyan-400">Safe</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={handleInputChange}
                placeholder="Enter or paste a URL to scan..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleScan}
              disabled={!url || isScanning}
              className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors duration-300
                ${!url || isScanning ? 'bg-gray-700 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600'}`}
            >
              {isScanning ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Scan
                </>
              )}
            </button>
          </div>
          
          {scanResult && (
            <div className={`mt-8 p-6 rounded-lg border ${
              scanResult.status === 'safe' 
                ? 'bg-green-900/20 border-green-700' 
                : 'bg-red-900/20 border-red-700'
            }`}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <div className={`flex items-center justify-center p-3 rounded-full ${
                  scanResult.status === 'safe' ? 'bg-green-700/30' : 'bg-red-700/30'
                }`}>
                  {scanResult.status === 'safe' ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {scanResult.status === 'safe' ? 'Safe' : 'Phishing Detected'}
                    <span className={`text-sm px-2 py-1 rounded ${
                      scanResult.status === 'safe' ? 'bg-green-700/40 text-green-300' : 'bg-red-700/40 text-red-300'
                    }`}>
                      {scanResult.confidence}% confidence
                    </span>
                  </h3>
                  <p className="text-lg mt-1">
                    {scanResult.status === 'safe' ? 
                      'This URL appears to be legitimate' : 
                      'This URL is potentially dangerous'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-300 mb-1">Analysis:</h4>
                  <p className="text-gray-300">{scanResult.explanation}</p>
                </div>
                
                <div className={`flex items-start gap-3 p-4 border rounded-lg ${
                  scanResult.status === 'safe' 
                    ? 'border-green-700/50 bg-green-900/10' 
                    : 'border-red-700/50 bg-red-900/10'
                }`}>
                  <ArrowRight className={`h-5 w-5 mt-0.5 ${
                    scanResult.status === 'safe' ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <div>
                    <h4 className="font-medium mb-1">Recommendation:</h4>
                    <p>{scanResult.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Scanner;