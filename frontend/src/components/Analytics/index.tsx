import React, { useState } from 'react';
import { BarChart3, PieChart, LineChart, ClipboardList } from 'lucide-react';
import PieChartComponent from './PieChartComponent';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';
import RecentScans from './RecentScans';

type TabType = 'overview' | 'pie' | 'bar' | 'line' | 'table';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <section id="analytics" className="py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-700">
          <div className="flex overflow-x-auto">
            <TabButton 
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              icon={<BarChart3 size={18} />}
              label="Overview"
            />
            <TabButton 
              isActive={activeTab === 'pie'} 
              onClick={() => setActiveTab('pie')}
              icon={<PieChart size={18} />}
              label="Phishing Rate"
            />
            <TabButton 
              isActive={activeTab === 'bar'} 
              onClick={() => setActiveTab('bar')}
              icon={<BarChart3 size={18} />}
              label="Top Keywords"
            />
            <TabButton 
              isActive={activeTab === 'line'} 
              onClick={() => setActiveTab('line')}
              icon={<LineChart size={18} />}
              label="Weekly Trends"
            />
            <TabButton 
              isActive={activeTab === 'table'} 
              onClick={() => setActiveTab('table')}
              icon={<ClipboardList size={18} />}
              label="Recent Scans"
            />
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium mb-4">Phishing vs Safe Links</h3>
                <div className="h-64">
                  <PieChartComponent />
                </div>
              </div>
              <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium mb-4">Top Phishing Keywords</h3>
                <div className="h-64">
                  <BarChartComponent />
                </div>
              </div>
              <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Weekly Phishing Trend</h3>
                <div className="h-64">
                  <LineChartComponent />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'pie' && (
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-medium mb-6">Phishing vs Safe Links</h3>
              <div className="h-80">
                <PieChartComponent />
              </div>
              <div className="mt-6 text-gray-300">
                <p>This chart shows the proportion of phishing links detected versus safe links. Over the past month, approximately 32% of all scanned links were identified as potential phishing attempts.</p>
              </div>
            </div>
          )}
          {activeTab === 'bar' && (
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-medium mb-6">Top Phishing Keywords</h3>
              <div className="h-80">
                <BarChartComponent />
              </div>
              <div className="mt-6 text-gray-300">
                <p>The chart displays the most common keywords found in phishing URLs and messages. Terms like "account", "verify", and "login" are frequently used to create a false sense of urgency or legitimacy.</p>
              </div>
            </div>
          )}
          {activeTab === 'line' && (
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-medium mb-6">Weekly Phishing Trend</h3>
              <div className="h-80">
                <LineChartComponent />
              </div>
              <div className="mt-6 text-gray-300">
                <p>This chart tracks the weekly trend of phishing attempts detected. There's been a notable increase in phishing activity over the past few weeks, particularly targeting financial services and e-commerce users.</p>
              </div>
            </div>
          )}
          {activeTab === 'table' && <RecentScans />}
        </div>
      </div>
    </section>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => (
  <button
    className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors duration-200 border-b-2 ${
      isActive 
        ? 'text-cyan-400 border-cyan-400' 
        : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/30'
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

export default Analytics;