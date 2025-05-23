import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, AlertTriangle, Eye, Lock } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const Education: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>('faq-1');

  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'What is phishing?',
      answer: 'Phishing is a type of cyber attack where attackers disguise themselves as trustworthy entities to trick victims into revealing sensitive information such as passwords, credit card numbers, or personal data. These attacks typically come via email, text messages, or fraudulent websites that mimic legitimate organizations.',
      icon: <Shield className="h-6 w-6 text-cyan-400" />,
    },
    {
      id: 'faq-2',
      question: 'Common phishing tactics',
      answer: 'Phishers use various tactics including: creating urgency or fear, impersonating trusted organizations, using misleading domain names, including suspicious attachments, requesting personal information, containing poor spelling or grammar, and using deceptive links that appear legitimate but lead to malicious sites.',
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
    },
    {
      id: 'faq-3',
      question: 'How to protect yourself',
      answer: 'To protect yourself from phishing: verify sender email addresses, check links before clicking (hover to see the actual URL), never provide personal information in response to unsolicited requests, enable two-factor authentication, keep software and browsers updated, use spam filters, be cautious of unexpected attachments, and use security software.',
      icon: <Lock className="h-6 w-6 text-blue-400" />,
    },
    {
      id: 'faq-4',
      question: 'Real examples of phishing messages',
      answer: 'Common examples include fake password reset emails from services like Google or Microsoft, fake order confirmations from Amazon or other retailers, fake account verification requests from banks, fake delivery notifications from shipping companies, and fake login alerts claiming someone accessed your account from an unknown location.',
      icon: <Eye className="h-6 w-6 text-purple-400" />,
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="education" className="py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Learn How to Spot a Phishing Attack
        </h2>
        <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
          Educate yourself on the common tactics used by phishers and how to protect your personal information from cyber threats.
        </p>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center">
                  <div className="mr-3">{item.icon}</div>
                  <h3 className="text-lg font-medium text-left">{item.question}</h3>
                </div>
                {openItem === item.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {openItem === item.id && (
                <div className="px-6 pb-4 text-gray-300 border-t border-gray-700 pt-4">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-800/50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Shield className="h-5 w-5 text-cyan-400 mr-2" />
            Pro Security Tips
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <div className="mt-1 mr-2 bg-cyan-900/60 rounded-full p-1">
                <CheckIcon />
              </div>
              <p>Always check the sender's email address carefully, not just the display name.</p>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 bg-cyan-900/60 rounded-full p-1">
                <CheckIcon />
              </div>
              <p>Be wary of emails creating a sense of urgency or fear to prompt immediate action.</p>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 bg-cyan-900/60 rounded-full p-1">
                <CheckIcon />
              </div>
              <p>Verify requests for information by contacting the company directly through their official website.</p>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 bg-cyan-900/60 rounded-full p-1">
                <CheckIcon />
              </div>
              <p>Enable 2FA (two-factor authentication) wherever possible for added security.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Education;