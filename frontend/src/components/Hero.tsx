"use client";

import { useEffect, useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      id="home" 
      className="relative pt-32 pb-20 overflow-hidden"
    >
     
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
      
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,24,53,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,24,53,0.3)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className={`md:w-1/2 space-y-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-400 rounded-full font-medium text-sm mb-2">
              Advanced Cybersecurity
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              PhishShield AI: <span className="text-cyan-400">Stay Safe</span> From Online Threats
            </h1>
            <p className="text-lg text-gray-300">
              Detect and learn about phishing links in real-time. Our advanced AI helps you
              identify threats before they compromise your security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/#scanner" 
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors duration-300 font-medium text-center"
              >
                Try Scanner
              </Link>
              <Link 
                href="/#education" 
                className="px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-400 rounded-md transition-colors duration-300 font-medium text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className={`md:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-8 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                  <IconCard 
                    icon={<Shield className="h-8 w-8 text-cyan-400" />}
                    title="Real-time Protection"
                    delay="0"
                  />
                  <IconCard 
                    icon={<Lock className="h-8 w-8 text-blue-400" />}
                    title="Secure Browsing"
                    delay="100"
                  />
                  <IconCard 
                    icon={<Eye className="h-8 w-8 text-purple-400" />}
                    title="Threat Detection"
                    delay="200"
                  />
                  <IconCard 
                    icon={<AlertTriangle className="h-8 w-8 text-amber-400" />}
                    title="Risk Analysis"
                    delay="300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface IconCardProps {
  icon: React.ReactNode;
  title: string;
  delay: string;
}

const IconCard: React.FC<IconCardProps> = ({ icon, title, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, parseInt(delay));

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`flex flex-col items-center text-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {icon}
      <h3 className="mt-3 font-medium">{title}</h3>
    </div>
  );
};

export default Hero;