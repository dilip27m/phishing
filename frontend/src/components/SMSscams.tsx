
import React, { useState } from 'react';
import { MessageCircle, Link2, Package, Banknote, ShieldAlert, ArrowRight, CheckCircle, Gift, AlertTriangle } from 'lucide-react'; // Using MessageCircle for SMS

interface ScamExample {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  scenarioMessage: string; 
  redFlags: string[];
  howToStaySafe: string[];
}

const SMSscams: React.FC = () => {
  const [expandedScam, setExpandedScam] = useState<number | null>(null);

  const scams: ScamExample[] = [
    {
      id: 1,
      title: "Fake Delivery Notification (Smishing)",
      description: "Tricking you with false package delivery alerts.",
      icon: <Package className="h-6 w-6 text-yellow-400" />,
      scenarioMessage: "Your package [Tracking ID] is pending. Please confirm your shipping details and pay a small redelivery fee at: [bit.ly/faketrackingsite]",
      redFlags: [
        "Unexpected delivery notifications for items you didn't order.",
        "Requests for small payments or 'customs fees' via SMS.",
        "Links that are shortened (e.g., bit.ly, tinyurl) or go to unofficial-looking tracking sites.",
        "Urgent calls to action to avoid package return.",
      ],
      howToStaySafe: [
        "Always track packages directly through the official courier's website or app.",
        "Never click on tracking links in unsolicited SMS messages.",
        "Legitimate couriers rarely ask for payment updates via SMS for standard deliveries.",
      ],
    },
    {
      id: 2,
      title: "Urgent Bank Alert / Security Warning",
      description: "Scammers impersonating your bank to steal login credentials.",
      icon: <Banknote className="h-6 w-6 text-green-400" />,
      scenarioMessage: "Security Alert: Unusual activity detected on your [Bank Name] account. Please verify your identity immediately by logging in at: [fake-bank-login.com/verify]",
      redFlags: [
        "SMS messages asking you to click a link to 'verify' or 'unlock' your account.",
        "Links leading to websites that look like your bank's but have slightly different URLs.",
        "Messages creating a strong sense of urgency or fear.",
        "Requests for your full PIN, password, or One-Time Passcodes (OTPs) via SMS or a linked site (banks never ask for full PINs/passwords this way).",
      ],
      howToStaySafe: [
        "Never click links in suspicious bank alert SMS messages.",
        "If you're concerned, contact your bank directly using the phone number on the back of your card or their official website (typed manually into your browser).",
        "Enable transaction alerts and security notifications from your bank through their official app or website.",
      ],
    },
    {
      id: 3,
      title: "Fake Prize / Lottery Win via SMS",
      description: "Luring with non-existent prizes to get personal info or money.",
      icon: <Gift className="h-6 w-6 text-purple-400" />,
      scenarioMessage: "CONGRATS! You've won a new iPhone15 in our weekly draw! To claim, visit: [claim-your-prize-now.info] and enter your details.",
      redFlags: [
        "Notifications about winning a lottery or prize you never entered.",
        "Requests for personal information or a fee to claim your 'prize'.",
        "Links to generic-looking prize claim websites.",
      ],
      howToStaySafe: [
        "If it sounds too good to be true, it almost certainly is. Delete the message.",
        "Never pay a fee or provide extensive personal details to claim an unsolicited prize.",
        "Legitimate lotteries don't notify winners via random SMS with links.",
      ],
    },
    
  ];

  return (
    <section id="sms-scams" className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" /> 
          <h2 className="text-2xl md:text-3xl font-bold mb-2">SMS Phishing (Smishing) Alerts</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Be aware of these common SMS-based phishing tactics designed to steal your information through text messages.
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
                    <p className="italic text-gray-300">SMS Example: "{scam.scenarioMessage}"</p>
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

export default SMSscams;