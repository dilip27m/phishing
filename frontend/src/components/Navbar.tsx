"use client";

import { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current path is dashboard or a subpage of dashboard
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold">PhishShield AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/#home">Home</NavLink>
            {isDashboard ? (
              <NavLink href="/#home">Return Home</NavLink>
            ) : (
              <NavLink href="/dashboard">Dashboard</NavLink>
            )}
            <NavLink href="/#scanner">Scanner</NavLink>
            <NavLink href="/#analytics">Analytics</NavLink>
            <NavLink href="/#education">Education</NavLink>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-3">
            <NavLink href="/#home" mobile>Home</NavLink>
            {isDashboard ? (
              <NavLink href="/#home" mobile>Return Home</NavLink>
            ) : (
              <NavLink href="/dashboard" mobile>Dashboard</NavLink>
            )}
            <NavLink href="/#scanner" mobile>Scanner</NavLink>
            <NavLink href="/#analytics" mobile>Analytics</NavLink>
            <NavLink href="/#education" mobile>Education</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile }) => {
  return (
    <Link
      href={href}
      className={`text-gray-300 hover:text-white transition-colors duration-300 ${
        mobile ? 'block py-2' : ''
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;