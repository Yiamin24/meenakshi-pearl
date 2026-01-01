import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';

export default function Loader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => setStage(2), 1600);
    const timer3 = setTimeout(() => setStage(3), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage >= 3 ? 0 : 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Meenakshi Pearl Logo */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: stage >= 0 ? 1 : 0, scale: stage >= 0 ? 1 : 0.8 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Image
          src="https://static.wixstatic.com/media/cef78c_c6d8a435aea5404b8ab01167c045f18b~mv2.png"
          alt="Meenakshi Pearl Logo"
          width={280}
          height={100}
          className="drop-shadow-[0_0_20px_rgba(184,134,11,0.5)]"
        />
      </motion.div>

      {/* Wave Line */}
      <motion.svg
        width="200"
        height="40"
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
      >
        <motion.path
          d="M 0 20 Q 25 10, 50 20 T 100 20 T 150 20 T 200 20"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 2 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="font-paragraph text-champagne-beige text-sm">
          Loading your luxury experience...
        </p>
      </motion.div>
    </motion.div>
  );
}
