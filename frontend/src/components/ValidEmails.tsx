'use client';
import React from 'react';

const validEmails = ['@gmail.com', '@outlook.com', '@protonmail.com', '@yahoo.com'];
const suspiciousEmails = ['@secure-login.com', '@bank-alert.co', '@mail-recovery.net', '@verify-pay.info'];

const ValidEmails: React.FC = () => {
  return (
    <div className="bg-[#1E293B] p-6 rounded-xl shadow-md mt-12">
      <h2 className="text-xl font-semibold text-white mb-4">📧 Recognize Valid Email Domains</h2>
      <p className="text-gray-400 mb-4">
        Phishers often use look-alike domains. Here's how to spot the difference.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-green-400 font-semibold mb-2">✅ Common Safe Domains</h3>
          <ul className="list-disc list-inside text-gray-300">
            {validEmails.map((domain, index) => (
              <li key={index}>{domain}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Suspicious or Fake Domains</h3>
          <ul className="list-disc list-inside text-gray-300">
            {suspiciousEmails.map((domain, index) => (
              <li key={index}>{domain}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidEmails;
