import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenContactForm?: () => void;
}

export default function Header({ onOpenContactForm }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Plots', href: '#plots' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Contact', href: '#own-legacy' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 border-b border-primary/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
          <nav className="hidden md:flex flex-1 justify-center gap-8 lg:gap-12">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleNavClick(item.href)}
                className={`font-paragraph text-sm uppercase tracking-widest transition-colors duration-300 ${
                  isScrolled
                    ? 'text-warm-espresso hover:text-primary'
                    : 'text-off-white hover:text-primary drop-shadow-lg'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Enquire Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block"
            >
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 font-paragraph text-sm px-8 py-3 rounded-xl tracking-wide transition-all duration-300 hover:scale-105 shadow-md"
                onClick={onOpenContactForm}
              >
                Enquire Now
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isScrolled
                  ? 'text-warm-espresso'
                  : 'text-off-white drop-shadow-lg'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden pb-4 space-y-3 ${
              isScrolled ? 'bg-background/90' : 'bg-black/30'
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left font-paragraph text-sm uppercase tracking-widest py-2 transition-colors ${
                  isScrolled
                    ? 'text-warm-espresso hover:text-primary'
                    : 'text-off-white hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-primary/20">
              <Button
                size="sm"
                className="w-full bg-primary text-white hover:bg-primary/90 font-paragraph text-xs px-6 py-2 rounded-lg"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenContactForm?.();
                }}
              >
                Enquire Now
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
