import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const footerInView = useInView(footerRef, { once: false, amount: 0.3 });

  return (
    <motion.footer
      ref={footerRef}
      className="relative w-full py-16 px-4 md:px-8 bg-background border-t border-primary/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: footerInView ? 1 : 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="max-w-[100rem] mx-auto">
        {/* Gold Divider */}
        <motion.div
          className="w-24 h-1 bg-primary mx-auto mb-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: footerInView ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: footerInView ? 1 : 0, y: footerInView ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(184,134,11,0.4)]"
          >
            <defs>
              <linearGradient id="footerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#B8860B" />
                <stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="60"
              fontWeight="700"
              fontFamily="cormorantgaramond"
              fill="url(#footerGoldGradient)"
            >
              M
            </text>
          </svg>
          <h3 className="font-heading text-3xl text-primary mb-2">Meenakshi Pearl</h3>
        </motion.div>

        {/* Brand Statement */}
        <motion.p
          className="font-paragraph text-champagne-beige text-center max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: footerInView ? 1 : 0, y: footerInView ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          A premium plotted development offering Grade-A investment opportunities in East Bangalore's most promising growth corridor. Experience luxury living with world-class infrastructure and amenities.
        </motion.p>

        {/* Contact Info */}
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 font-paragraph text-champagne-beige"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: footerInView ? 1 : 0, y: footerInView ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="text-center md:text-left">
            <p className="text-primary font-medium mb-1">Sales Office</p>
            <p className="text-sm">Sarjapur Road, Bangalore</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-primary/30" />
          <div className="text-center md:text-left">
            <p className="text-primary font-medium mb-1">Contact</p>
            <p className="text-sm">+91 98765 43210</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-primary/30" />
          <div className="text-center md:text-left">
            <p className="text-primary font-medium mb-1">Email</p>
            <p className="text-sm">info@meenakshipearl.com</p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="border-t border-primary/10 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: footerInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          <p className="font-paragraph text-champagne-beige/60 text-xs text-center max-w-4xl mx-auto leading-relaxed">
            Disclaimer: All information provided is for general informational purposes only. While we strive to ensure accuracy, specifications, amenities, and pricing are subject to change without notice. Please verify all details with our sales team before making any investment decisions. Images and renderings are for representational purposes only and may not reflect the actual product. RERA registration details available on request.
          </p>
          <p className="font-paragraph text-champagne-beige/40 text-xs text-center mt-6">
            © {new Date().getFullYear()} Meenakshi Pearl. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
