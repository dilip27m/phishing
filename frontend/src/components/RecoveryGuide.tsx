import React, { useState } from 'react';
import { ShieldAlert, Lock, CreditCard, Mail, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: string[];
  urgency: 'immediate' | 'important' | 'recommended';
}

const RecoveryGuide: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const steps: Step[] = [
    {
      id: 1,
      title: "Immediate Actions",
      description: "Take these steps right away to minimize damage",
      icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
      urgency: 'immediate',
      actions: [
        "Disconnect your device from the internet to prevent further data transmission",
        "Take screenshots or photos of the phishing attempt for reporting",
        "Change passwords for any accounts you entered information into",
        "Enable two-factor authentication where available",
        "Run a full antivirus scan on your device"
      ]
    },
    {
      id: 2,
      title: "Financial Security",
      description: "Protect your money and cards",
      icon: <CreditCard className="h-6 w-6 text-amber-400" />,
      urgency: 'immediate',
      actions: [
        "Contact your bank or credit card company immediately",
        "Request new cards if you shared card details",
        "Monitor your accounts for suspicious transactions",
        "Set up transaction alerts for your accounts",
        "Check your credit report for unauthorized accounts"
      ]
    },
    {
      id: 3,
      title: "Account Recovery",
      description: "Secure your online presence",
      icon: <Lock className="h-6 w-6 text-cyan-400" />,
      urgency: 'important',
      actions: [
        "Change passwords for ALL your accounts, especially if you reuse passwords",
        "Review account recovery options and security questions",
        "Check account settings for unauthorized changes",
        "Remove any suspicious apps or connected services",
        "Review recent account activity for signs of compromise"
      ]
    },
    {
      id: 4,
      title: "Report the Attack",
      description: "Help prevent future attacks",
      icon: <Mail className="h-6 w-6 text-blue-400" />,
      urgency: 'recommended',
      actions: [
        "Forward phishing emails to your country's cybersecurity authority",
        "Report the incident to your workplace IT department if applicable",
        "File a report with your local police cybercrime unit",
        "Report the phishing website to Google Safe Browsing",
        "Alert friends and family if your accounts were compromised"
      ]
    }
  ];

  const getUrgencyStyle = (urgency: Step['urgency']) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-900/20 text-red-400 border-red-700/50';
      case 'important':
        return 'bg-amber-900/20 text-amber-400 border-amber-700/50';
      case 'recommended':
        return 'bg-blue-900/20 text-blue-400 border-blue-700/50';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-700/50';
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Recovery Guide</h2>
          <p className="text-gray-300">
            If you've fallen victim to a phishing attack, don't panic. Follow these steps to secure your accounts and prevent further damage.
          </p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Time is Critical</h3>
                <p className="text-gray-300">
                  The faster you act, the better chance you have of minimizing damage. Follow these steps in order of urgency.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getUrgencyStyle(step.urgency)}`}>
                      {step.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    expandedStep === step.id ? 'rotate-90' : ''
                  }`} />
                </button>
                
                {expandedStep === step.id && (
                  <div className="px-6 pb-4 border-t border-gray-700">
                    <ul className="mt-4 space-y-3">
                      {step.actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            <CheckCircle className="h-4 w-4 text-cyan-400" />
                          </div>
                          <span className="text-gray-300">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecoveryGuide;