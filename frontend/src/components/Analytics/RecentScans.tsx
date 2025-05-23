import React from 'react';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface Scan {
  id: string;
  url: string;
  timestamp: string;
  status: 'safe' | 'phishing';
  confidence: number;
}

const RecentScans: React.FC = () => {
  // Mock data for the table
  const scans: Scan[] = [
    {
      id: '1',
      url: 'https://legitimate-bank.com/login',
      timestamp: '2025-03-15 14:32:18',
      status: 'safe',
      confidence: 94,
    },
    {
      id: '2',
      url: 'https://amazon-account-verify.suspicious.net',
      timestamp: '2025-03-15 13:45:09',
      status: 'phishing',
      confidence: 98,
    },
    {
      id: '3',
      url: 'https://paypal-secure-login.phishing-site.com',
      timestamp: '2025-03-15 12:18:45',
      status: 'phishing',
      confidence: 99,
    },
    {
      id: '4',
      url: 'https://netflix.com/account',
      timestamp: '2025-03-15 11:02:37',
      status: 'safe',
      confidence: 96,
    },
    {
      id: '5',
      url: 'https://google.com/search',
      timestamp: '2025-03-15 10:55:21',
      status: 'safe',
      confidence: 99,
    },
    {
      id: '6',
      url: 'https://verify-your-account-now.suspicious.org',
      timestamp: '2025-03-15 09:42:14',
      status: 'phishing',
      confidence: 97,
    },
  ];

  return (
    <div className="bg-gray-800/80 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">URL</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Confidence</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {scans.map((scan) => (
              <tr 
                key={scan.id} 
                className="hover:bg-gray-700/30 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-sm">
                  <div className="max-w-xs truncate text-gray-300">
                    {scan.url}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {scan.timestamp}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {scan.status === 'safe' ? (
                      <>
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-green-400 text-sm font-medium">Safe</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} className="text-red-500 mr-2" />
                        <span className="text-red-400 text-sm font-medium">Phishing</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          scan.status === 'safe' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${scan.confidence}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-400 text-xs">{scan.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-150 flex items-center"
                  >
                    <span className="mr-1">Details</span>
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScans;