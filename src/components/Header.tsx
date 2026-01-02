import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Plots', href: '#plots' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero section (approximately 600px)
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/95 border-b border-primary/20 shadow-lg' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      {/* Subtle overlay that appears on scroll */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
        isScrolled 
          ? 'bg-old-lace/40 opacity-100' 
          : 'bg-old-lace/0 opacity-0'
      }`} />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <Image
              src="https://static.wixstatic.com/media/cef78c_c6d8a435aea5404b8ab01167c045f18b~mv2.png"
              alt="Meenakshi Pearl Logo"
              width={120}
              height={42}
              className="w-24 sm:w-28 md:w-32 h-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleNavClick(item.href)}
                className={`font-paragraph text-sm uppercase tracking-widest transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-foreground/70 hover:text-primary' 
                    : 'text-foreground/80 hover:text-primary'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled 
                ? 'text-foreground hover:text-primary' 
                : 'text-foreground hover:text-primary'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden pb-4 space-y-3 ${isScrolled ? 'bg-background/50' : 'bg-black/20'}`}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left font-paragraph text-sm uppercase tracking-widest transition-colors duration-300 py-2 ${
                  isScrolled 
                    ? 'text-foreground/70 hover:text-primary' 
                    : 'text-foreground/80 hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
}
