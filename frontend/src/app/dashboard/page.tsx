'use client';
import React, { useEffect, useState } from 'react';
import PieChartComponent from '@/components/Analytics/PieChartComponent';
import RecentScans from '@/components/Analytics/RecentScans';

interface Stats {
  total_scans: number;
  phishing_detected: number;
  safe_scans: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({
    total_scans: 0,
    phishing_detected: 0,
    safe_scans: 0,
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Dashboard stats:", data);
        setStats(data);
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  return (
    <div className="bg-[#0F172A] min-h-screen px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">📊 PhishShield Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Scans" value={stats.total_scans} />
        <StatCard label="Phishing Blocked" value={stats.phishing_detected} />
        <StatCard label="Safe Sites" value={stats.safe_scans} />
      </div>

      <div className="mb-10">
        <PieChartComponent
          phishing={stats.phishing_detected}
          safe={stats.safe_scans}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Scan Results</h2>
        <RecentScans />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-[#1E293B] rounded-xl text-center p-6 shadow-md">
    <div className="text-4xl font-bold text-cyan-400">{value}</div>
    <div className="text-sm text-gray-400 mt-2">{label}</div>
  </div>
);

export default DashboardPage;
