import React, { useState } from 'react';
import { Users, Heart, Image as ImageIcon, FileText, ShieldAlert, ArrowRight, CheckCircle, AlertTriangle, Gift } from 'lucide-react'; // Users for general social media

interface ScamExample {
  id: number;
  title: string;
  platforms: string; 
  icon: React.ReactNode;
  scenarioDescription: string; 
  exampleInteraction?: string; 
  redFlags: string[];
  howToStaySafe: string[];
}

const SocialMediaScams: React.FC = () => {
  const [expandedScam, setExpandedScam] = useState<number | null>(null);

  const scams: ScamExample[] = [
    {
      id: 1,
      title: "Romance Scams / Fake Profiles ('Lady Profiles')",
      platforms: "Instagram, Facebook, Dating Apps, X (Twitter)",
      icon: <Heart className="h-6 w-6 text-pink-400" />,
      scenarioDescription: "Scammers create fake attractive profiles, often using stolen photos. They build an emotional connection or romantic relationship quickly, then start asking for money for emergencies, travel, or investments.",
      exampleInteraction: "\"Hi there, I came across your profile and you seem really interesting! I'm new in town / going through a tough time... Could you help me with [request for money/gift cards]?\"",
      redFlags: [
        "Profile seems too good to be true (e.g., model-like photos, claims of high wealth but needs money).",
        "Develops strong feelings or professes love very quickly.",
        "Avoids video calls or meeting in person, often with excuses.",
        "Story has inconsistencies or sounds like a soap opera.",
        "Eventually asks for money, gift cards, or bank account details for various 'emergencies' or 'opportunities'.",
        "May try to lure you off the platform to less secure communication channels.",
      ],
      howToStaySafe: [
        "Be cautious of profiles that seem overly perfect or move too fast emotionally.",
        "Do a reverse image search of their profile pictures.",
        "Never send money or share financial information with someone you've only met online.",
        "Be wary of anyone who consistently avoids video calls or meeting in person.",
        "Trust your gut. If something feels off, it probably is.",
      ],
    },
    {
      id: 2,
      title: "Malicious Links & File Sharing (e.g., .apk files)",
      platforms: "Facebook, Instagram DMs, X (Twitter), WhatsApp, Telegram",
      icon: <FileText className="h-6 w-6 text-indigo-400" />,
      scenarioDescription: "Scammers share links to fake login pages, websites infected with malware, or directly send malicious files like .apk (Android application package) files disguised as useful apps or updates.",
      exampleInteraction: "\"Hey, check out this cool new photo editor / game! Download the .apk here: [suspicious-link.com/app.apk]\" OR \"Your account has suspicious activity, log in here to secure it: [facebook-security-login.fakedomain.net]\"",
      redFlags: [
        "Unsolicited messages with links or attachments, even from accounts that look like friends (their account might be compromised).",
        "Links that are shortened or lead to unofficial-looking websites.",
        "Pressure to download and install .apk files from outside the official Google Play Store (sideloading).",
        "Websites asking for your social media login credentials that aren't the official site.",
        "Poor grammar or unusual urgency in the message.",
      ],
      howToStaySafe: [
        "Never click on suspicious links or download attachments from unknown or untrusted sources.",
        "Only download Android apps from the official Google Play Store. Be very cautious about installing .apk files from other sources.",
        "Always verify the website URL before entering login credentials. Look for HTTPS and the correct domain name.",
        "If a friend sends a suspicious link or file, verify with them through a different communication channel.",
      ],
    },
    {
      id: 3,
      title: "Fake Giveaways & Contests",
      platforms: "Instagram, Facebook, X (Twitter), YouTube comments",
      icon: <Gift className="h-6 w-6 text-teal-400" />,
      scenarioDescription: "Fraudulent posts or messages claim you've won a prize or can enter a high-value giveaway, often requiring you to click a link, provide personal information, or send a small fee.",
      exampleInteraction: "\"Congratulations! You've been selected to win a new iPhone! To claim, click the link in our bio and complete a short survey (and provide your address and credit card for shipping).\"",
      redFlags: [
        "Giveaways from unverified accounts or pages with few followers/low engagement.",
        "Requests for personal information, login details, or payment to claim a prize.",
        "Being asked to share the post widely or tag many friends to 'increase your chances'.",
        "Links leading to survey sites that collect excessive personal data or require software downloads.",
      ],
      howToStaySafe: [
        "Be skeptical of giveaways that seem too good to be true or require sensitive information.",
        "Verify the legitimacy of the brand or influencer running the contest through their official, verified channels.",
        "Never pay a fee to receive a prize.",
        "Legitimate giveaways usually don't require you to provide credit card details for shipping a free prize.",
      ],
    },
   
  ];

  return (
    <section id="social-media-scams" className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Social Media Phishing & Scams</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Social media platforms are common targets for scammers. Learn to spot fake profiles, malicious links, and deceptive tactics.
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
                  <div>
                    <h3 className="text-lg font-semibold">{scam.title}</h3>
                    <p className="text-xs text-gray-400">{scam.platforms}</p>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedScam === scam.id ? 'rotate-90' : ''}`} />
              </button>

              {expandedScam === scam.id && (
                <div className="px-6 pb-6 border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-300 mb-4">{scam.scenarioDescription}</p>
                  {scam.exampleInteraction && (
                    <div className="mb-6 p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <p className="italic text-gray-300">Example: "{scam.exampleInteraction}"</p>
                    </div>
                  )}

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

export default SocialMediaScams;