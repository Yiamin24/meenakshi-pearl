import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const footerInView = useInView(footerRef, { once: false, amount: 0.3 });

  return (
    <motion.footer
      ref={footerRef}
      className="relative w-full py-6 sm:py-10 md:py-16 px-4 sm:px-6 md:px-8 bg-background border-t border-primary/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: footerInView ? 1 : 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="max-w-[100rem] mx-auto">
        {/* Gold Divider */}
        <motion.div
          className="w-12 sm:w-16 md:w-24 h-1 bg-primary mx-auto mb-6 sm:mb-8 md:mb-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: footerInView ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Logo */}
        <motion.div
          className="text-center mb-4 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: footerInView ? 1 : 0, y: footerInView ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <Image
            src="https://static.wixstatic.com/media/cef78c_c6d8a435aea5404b8ab01167c045f18b~mv2.png"
            alt="Meenakshi Pearl Logo"
            width={200}
            height={70}
            className="mx-auto mb-2 sm:mb-3 drop-shadow-[0_0_15px_rgba(184,134,11,0.4)] w-auto h-auto max-w-xs sm:max-w-sm"
          />
        </motion.div>

        {/* Brand Statement */}
        <motion.p
          className="font-paragraph text-foreground/70 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: footerInView ? 1 : 0, y: footerInView ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          A premium plotted development offering Grade-A investment opportunities in East Bangalore's most promising growth corridor. Experience luxury living with world-class infrastructure and amenities.
        </motion.p>

        {/* Contact Info */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10 md:mb-12 font-paragraph text-foreground/70 text-xs sm:text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: footerInView ? 1 : 0, y: footerInView ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="text-center sm:text-left">
            <p className="text-primary font-medium mb-0.5 sm:mb-1">Head Office</p>
            <p className="text-[10px] sm:text-xs md:text-sm">New Thippasandra, Indiranagar</p>
          </div>
          <div className="hidden sm:block w-px h-6 sm:h-10 md:h-12 bg-primary/30" />
          <div className="text-center sm:text-left">
            <p className="text-primary font-medium mb-0.5 sm:mb-1">Contact</p>
            <p className="text-[10px] sm:text-xs md:text-sm">8792991263</p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="border-t border-primary/10 pt-4 sm:pt-6 md:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: footerInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          <p className="font-paragraph text-foreground/50 text-[9px] sm:text-xs text-center max-w-4xl mx-auto leading-relaxed mb-3 sm:mb-4 md:mb-6">
            Disclaimer: All information provided is for general informational purposes only. While we strive to ensure accuracy, specifications, amenities, and pricing are subject to change without notice. Please verify all details with our sales team before making any investment decisions. Images and renderings are for representational purposes only and may not reflect the actual product. RERA registration details available on request.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Link 
              to="/privacy-policy" 
              className="font-paragraph text-foreground/50 hover:text-primary text-[9px] sm:text-xs transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="font-paragraph text-foreground/30 text-[8px] sm:text-xs text-center">
            © {new Date().getFullYear()} Meenakshi Pearl. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
