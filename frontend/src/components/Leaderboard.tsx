import React from 'react';
import { Trophy, AlertTriangle } from 'lucide-react';

interface DangerousURL {
  id: number;
  url: string;
  detections: number;
  threatLevel: 'high' | 'critical';
}

const Leaderboard: React.FC = () => {
  const dangerousURLs: DangerousURL[] = [
    {
      id: 1,
      url: 'secure-login-verify.phishing-site.com',
      detections: 2457,
      threatLevel: 'critical',
    },
    {
      id: 2,
      url: 'account-verification-required.suspicious.net',
      detections: 1893,
      threatLevel: 'critical',
    },
    {
      id: 3,
      url: 'bank-account-alert.malicious-domain.org',
      detections: 1652,
      threatLevel: 'high',
    },
    {
      id: 4,
      url: 'paypal-secure-update.phish-attempt.com',
      detections: 1245,
      threatLevel: 'high',
    },
    {
      id: 5,
      url: 'amazon-order-confirmation.fake-site.net',
      detections: 982,
      threatLevel: 'high',
    },
  ];

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="h-5 w-5 text-amber-400 mr-2" />
        Top Phishing Domains
      </h3>
      <div className="space-y-3">
        {dangerousURLs.map((item, index) => (
          <div 
            key={item.id}
            className="bg-gray-800/80 rounded-lg p-3 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  {index + 1}
                </div>
                <div className="text-sm font-medium text-gray-300 max-w-[180px] truncate">
                  {item.url}
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                item.threatLevel === 'critical' 
                  ? 'bg-red-900/40 text-red-400' 
                  : 'bg-amber-900/40 text-amber-400'
              }`}>
                {item.threatLevel}
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
              <span>Detected {item.detections.toLocaleString()} times</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;