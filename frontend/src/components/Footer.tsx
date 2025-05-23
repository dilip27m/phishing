"use client";

import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-bold">PhishShield AI</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Advanced phishing detection powered by AI to keep you safe online.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Github size={18} />} href="#" />
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">API</FooterLink>
              <FooterLink href="#">Integrations</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Community</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; 2025 PhishShield AI. All rights reserved.
          </p>
          <div>
            <p className="text-gray-500 text-sm text-center md:text-right">
              Powered by TensorFlow and OpenAI GPT-4. Data sourced from PhishTank and APWG.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href }) => {
  return (
    <Link 
      href={href}
      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-300"
    >
      {icon}
    </Link>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <li>
      <Link 
        href={href}
        className="text-gray-400 hover:text-white transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;