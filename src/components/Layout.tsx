import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/next"
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/projects', label: 'Work' },
    { path: '/homelab', label: 'Homelab' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 p-6 ${isHomePage ? 'bg-transparent' : 'bg-black/80 backdrop-blur-sm'}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
            >
              <span className="text-black font-bold text-sm">F</span>
            </motion.div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center mt-4">
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
        <Analytics/>
      </main>
    </div>
  );
};