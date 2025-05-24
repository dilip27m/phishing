import React, { useEffect, useState } from 'react';

interface ScanEntry {
  id: number;
  url: string;
  is_phishing: boolean;
  confidence: number;
  timestamp: string;
}

const RecentScans: React.FC = () => {
  const [scans, setScans] = useState<ScanEntry[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recent')
      .then((res) => res.json())
      .then((data) => setScans(data.scans))
      .catch((err) => console.error('Error loading recent scans:', err));
  }, []);

  return (
    <div className="bg-gray-900 shadow-md rounded-lg p-4 overflow-x-auto">
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 text-gray-400">URL</th>
            <th className="py-2 text-gray-400">Phishing</th>
            <th className="py-2 text-gray-400">Confidence</th>
            <th className="py-2 text-gray-400">Time</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan.id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="py-2 text-blue-400 break-all">{scan.url}</td>
              <td className={`py-2 font-semibold ${scan.is_phishing ? 'text-red-400' : 'text-green-400'}`}>
                {scan.is_phishing ? 'Yes' : 'No'}
              </td>
              <td className="py-2">{(scan.confidence * 100).toFixed(1)}%</td>
              <td className="py-2 text-gray-400">{new Date(scan.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentScans;
