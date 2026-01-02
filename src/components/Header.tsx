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

  /* 🔥 EARLY SCROLL TRIGGER */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex h-16 sm:h-20 md:h-24 items-center justify-between">

          {/* Logo (Click → Top) */}
          <motion.button
            onClick={handleLogoClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="cursor-pointer"
            aria-label="Go to top"
          >
            <Image
              src="https://static.wixstatic.com/media/cef78c_c6d8a435aea5404b8ab01167c045f18b~mv2.png"
              alt="Meenakshi Pearl Logo"
              width={120}
              height={42}
              className="w-24 sm:w-28 md:w-32 h-auto"
            />
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-10">
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

          {/* Right Actions (Mobile + Desktop) */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">

            {/* Enquire Now — Always Visible */}
            <Button
              size="sm"
              className={`font-paragraph tracking-wide transition-all duration-300 ${
                isScrolled
                  ? 'bg-primary text-white'
                  : 'bg-primary text-white shadow-lg'
              } md:size-lg md:px-8 md:py-3 rounded-lg md:rounded-xl`}
              onClick={onOpenContactForm}
            >
              Enquire Now
            </Button>

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
              isScrolled ? 'bg-background/95' : 'bg-black/30'
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
          </motion.nav>
        )}
      </div>
    </header>
  );
}
