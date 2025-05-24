import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

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
    <div className="bg-[#1E293B] rounded-xl overflow-hidden shadow-sm border border-[#334155]">
      <table className="w-full text-sm text-gray-300">
        <thead className="text-gray-400 border-b border-[#334155]">
          <tr>
            <th className="py-3 px-4 text-left">URL</th>
            <th className="py-3 px-2 text-left">Time</th>
            <th className="py-3 px-2 text-left">Status</th>
            <th className="py-3 px-2 text-left">Confidence</th>
            <th className="py-3 px-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => {
            const confidence = (scan.confidence * 100).toFixed(0);
            const statusColor = scan.is_phishing ? 'bg-red-500/10 text-red-400 border border-red-500/40' : 'bg-green-500/10 text-green-400 border border-green-500/40';
            const barColor = scan.is_phishing ? 'bg-red-500' : 'bg-green-500';

            return (
              <tr key={scan.id} className="border-b border-[#273242] hover:bg-[#273040]/60">
                <td className="py-3 px-4 break-all text-cyan-400">{scan.url}</td>
                <td className="py-3 px-2 text-gray-400 whitespace-nowrap">{new Date(scan.timestamp).toLocaleString()}</td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${statusColor}`}>
                    {scan.is_phishing ? (
                      <>
                        <AlertTriangle size={14} /> Phishing
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} /> Safe
                      </>
                    )}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="w-24 bg-[#334155] rounded-full overflow-hidden h-2">
                    <div
                      className={`${barColor} h-full`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  <span className="ml-1 text-xs text-gray-400">{confidence}%</span>
                </td>
                <td className="py-3 px-2">
                  <a
                    href="#"
                    className="text-cyan-400 flex items-center gap-1 hover:underline"
                  >
                    Details <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentScans;
