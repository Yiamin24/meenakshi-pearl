import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero section (approximately 200px for faster trigger)
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 border-b border-primary/20 shadow-lg' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
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

          {/* Enquire Now Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              size="sm"
              className="bg-primary text-white hover:bg-primary/90 font-paragraph text-xs px-6 py-2 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Enquire Now
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
