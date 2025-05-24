'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Search } from 'lucide-react';

const validDomains = ['gmail.com', 'outlook.com', 'protonmail.com', 'yahoo.com'];
const suspiciousDomains = ['secure-login.com', 'mail-verification.co', 'payinfo-support.net', 'recovery-alerts.com'];

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<'valid' | 'invalid' | null>(null);

  const handleCheck = () => {
    const domain = email.split('@')[1];
    if (domain && validDomains.includes(domain.toLowerCase())) {
      setResult('valid');
    } else {
      setResult('invalid');
    }
  };

  return (
    <section className="py-16" id="verify-email">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Verify <span className="text-cyan-400">Email Domains</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setResult(null);
              }}
              placeholder="e.g. support@gmail.com"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleCheck}
              disabled={!email}
              className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors duration-300 ${
                !email
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              <Search size={20} />
              Check
            </button>
          </div>

          {result && (
            <div
              className={`mt-4 p-6 rounded-lg border ${
                result === 'valid'
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={`p-3 rounded-full ${
                    result === 'valid' ? 'bg-green-700/30' : 'bg-red-700/30'
                  }`}
                >
                  {result === 'valid' ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold">
                  {result === 'valid'
                    ? 'Trusted Email Domain'
                    : 'Suspicious Email Domain'}
                </h3>
              </div>

              <p className="text-gray-300">
                {result === 'valid'
                  ? 'This domain is widely used by reliable email providers.'
                  : 'This domain is not recognized as a common provider and may be spoofing a real service. Always double-check!'}
              </p>
            </div>
          )}

        
          <div className="mt-10 space-y-6 text-gray-300">
            <h3 className="text-xl font-semibold text-white">
              📘 How to Recognize a Trustworthy Email Domain
            </h3>
            <p>
              Attackers often disguise phishing emails using fake domains that look similar to real services.
              Always verify the domain part of the email (after the `@`) before clicking any link or replying.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="text-green-400 font-semibold mb-2">✅ Common Safe Domains</h4>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  {validDomains.map((domain, idx) => (
                    <li key={idx}>{domain}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-red-400 font-semibold mb-2">⚠️ Suspicious Domains</h4>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  {suspiciousDomains.map((domain, idx) => (
                    <li key={idx}>{domain}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4">
              For example:
              <br />
              ✅ <code className="text-green-400">support@paypal.com</code> → legitimate <br />
              ❌ <code className="text-red-400">support@paypal-verify.net</code> → phishing alert
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
