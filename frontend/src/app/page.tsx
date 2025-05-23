"use client";

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Scanner from '@/components/Scanner';
import Analytics from '@/components/Analytics';
import Education from '@/components/Education';
import DidYouKnow from '@/components/DidYouKnow';
import Leaderboard from '@/components/Leaderboard';
import Scenarios from '@/components/Scenarios';
import RecoveryGuide from '@/components/RecoveryGuide';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4">
        <Hero />
        <Scanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-12">
          <div className="lg:col-span-2">
            <Analytics />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <DidYouKnow />
            <Leaderboard />
          </div>
        </div>
        <Scenarios />
        <RecoveryGuide />
        <Education />
      </main>
      <Footer />
    </div>

   
  );
}