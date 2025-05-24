'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#4ade80', '#f87171']; // Tailwind green-400, red-400

const PieChartComponent: React.FC = () => {
  const [safe, setSafe] = useState(0);
  const [phishing, setPhishing] = useState(0);
  const [range, setRange] = useState<'7' | '30'>('7');
  const canvasRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/stats?days=${range}`);
      const data = await res.json();
      setSafe(data.safe_scans || 0);
      setPhishing(data.phishing_detected || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [range]);

  const chartData = [
    { name: 'Safe', value: safe },
    { name: 'Phishing', value: phishing },
  ];

  const total = safe + phishing;
  const centerText = total === 0 ? '0%' : `${Math.round((safe / total) * 100)}%`;

  const exportChart = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'scan-distribution.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSliceClick = (data: any) => {
    alert(`Clicked on: ${data?.name} → ${data?.value} scans`);
  };

  return (
    <div
      ref={canvasRef}
      className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 w-full h-[420px] flex flex-col items-center justify-between overflow-hidden"
    >
      <h3 className="text-white text-lg font-semibold">🧪 Scan Distribution</h3>

      {/* Time Filter */}
      <div className="flex gap-2 mt-2">
        {['7', '30'].map((val) => (
          <button
            key={val}
            onClick={() => setRange(val as '7' | '30')}
            className={`px-3 py-1 rounded text-sm ${range === val ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Last {val} Days
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              isAnimationActive={true}
              onClick={handleSliceClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                borderColor: '#334155',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Donut Center Label */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-semibold">
          {centerText}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
          Safe
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-400 rounded-full"></span>
          Phishing
        </div>
      </div>

      {/* Export */}
      <button
        onClick={exportChart}
        className="mt-4 text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
      >
        📤 Export PNG
      </button>
    </div>
  );
};

export default PieChartComponent;
