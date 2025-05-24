import React, { useState } from 'react';
import { MessageSquare, Link2, Gift, ShieldAlert, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface ScamExample {
  id: number;
  title: string;
  description: string; 
  icon: React.ReactNode;
  scenarioMessage: string; 
  redFlags: string[];
  howToStaySafe: string[];
}

const WhatsAppScams: React.FC = () => {
  const [expandedScam, setExpandedScam] = useState<number | null>(null);

  const scams: ScamExample[] = [
    {
      id: 1,
      title: "The 'Impersonating a Friend/Family' Scam",
      description: "Scammers pretend to be someone you know in distress.",
      icon: <MessageSquare className="h-6 w-6 text-green-400" />,
      scenarioMessage: "\"Hi, it's [Friend's Name], I lost my phone and this is my temporary number. I'm in a bit of trouble and need you to send me some money urgently. Can you help?\"",
      redFlags: [
        "Unexpected message from a new, unknown number claiming to be someone you know.",
        "Sense of urgency and immediate request for money or sensitive information.",
        "Unusual language or phrasing for that person.",
        "Reluctance to speak on the phone if you try to call.",
      ],
      howToStaySafe: [
        "Always verify the identity through another channel (e.g., call their old number, ask a mutual friend).",
        "Ask a question only the real person would know.",
        "Never send money based solely on a WhatsApp message, especially if it feels rushed.",
      ],
    },
    {
      id: 2,
      title: "The Fake Job Offer / Lottery Win",
      description: "Luring victims with too-good-to-be-true opportunities.",
      icon: <Gift className="h-6 w-6 text-purple-400" />,
      scenarioMessage: "\"Congratulations! You've been selected for a high-paying remote job / You've won our special lottery! Click this link to claim your prize/position: [suspicious_link.xyz]\"",
      redFlags: [
        "Unsolicited job offers or lottery notifications you didn't apply for/enter.",
        "Requests for upfront payment for 'processing fees' or 'registration'.",
        "Links to unofficial-looking websites or shortened URLs.",
        "Poor grammar and spelling in the message.",
      ],
      howToStaySafe: [
        "Be skeptical of unsolicited offers that seem too good to be true.",
        "Never pay upfront fees for a job or prize.",
        "Verify the company or lottery organization through official channels before clicking links.",
      ],
    },
    {
      id: 3,
      title: "The 'WhatsApp Update' or 'Premium Version' Scam",
      description: "Tricking users into downloading malware or giving up credentials.",
      icon: <Link2 className="h-6 w-6 text-blue-400" />,
      scenarioMessage: "\"Urgent: Your WhatsApp is outdated and will stop working. Click here to update to WhatsApp Gold/Premium for new features: [malicious_apk_link.com]\"",
      redFlags: [
        "WhatsApp updates always come through official app stores (Google Play Store, Apple App Store), not via direct messages with links.",
        "Promises of special 'Gold' or 'Premium' versions with exclusive features are usually scams.",
        "Links prompting you to download an APK file directly or visit a non-official site.",
      ],
      howToStaySafe: [
        "Only update WhatsApp through your official app store.",
        "Be wary of messages promising unreleased or special versions of the app.",
        "Never click links from unknown sources claiming to be official updates.",
      ],
    },
   
  ];

  return (
    <section id="whatsapp-scams" className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <MessageSquare className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">WhatsApp Phishing Scams</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Learn to identify common phishing tactics used on WhatsApp to protect your conversations and personal data.
          </p>
        </div>

        <div className="space-y-6">
          {scams.map((scam) => (
            <div key={scam.id} className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedScam(expandedScam === scam.id ? null : scam.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-gray-700/50 rounded-lg">{scam.icon}</div>
                  <h3 className="text-lg font-semibold">{scam.title}</h3>
                </div>
                <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedScam === scam.id ? 'rotate-90' : ''}`} />
              </button>

              {expandedScam === scam.id && (
                <div className="px-6 pb-6 border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400 mb-4">{scam.description}</p>
                  <div className="mb-6 p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                    <p className="italic text-gray-300">"{scam.scenarioMessage}"</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-red-400 flex items-center gap-2">
                        <AlertTriangle size={18} /> Red Flags:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {scam.redFlags.map((flag, index) => <li key={index}>{flag}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-green-400 flex items-center gap-2">
                        <CheckCircle size={18} /> How to Stay Safe:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                        {scam.howToStaySafe.map((tip, index) => <li key={index}>{tip}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsAppScams;