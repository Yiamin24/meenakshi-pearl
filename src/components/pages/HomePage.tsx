// Premium Light Theme - Redesigned
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import {
  GatedLivingBenefits,
  InfrastructureDetails,
  InvestmentHighlights,
  LegalApprovals,
  PlotConfigurations,
  ProjectAmenities,
} from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, ArrowRight, Check, Lock, TrendingUp, Sparkles, Target, Shield, Zap, Award, BarChart3 } from 'lucide-react';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';
import Amenities3DSection from '@/components/Amenities3DCard';
import ContactFormModal from '@/components/ContactFormModal';
import Header from '@/components/Header';

// --- Utility Components ---

const CinematicReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionDivider = () => (
  <div className="w-full flex justify-center py-12 md:py-24">
    <motion.div 
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "circOut" }}
      className="h-[1px] w-32 md:w-64 bg-gradient-to-r from-transparent via-primary to-transparent"
    />
  </div>
);

// --- Main Component ---

export default function HomePage() {
  const [legalApprovals, setLegalApprovals] = useState<LegalApprovals[]>([]);
  const [plotConfigs, setPlotConfigs] = useState<PlotConfigurations[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureDetails[]>([]);
  const [amenities, setAmenities] = useState<ProjectAmenities[]>([]);
  const [gatedBenefits, setGatedBenefits] = useState<GatedLivingBenefits[]>([]);
  const [investmentHighlights, setInvestmentHighlights] = useState<InvestmentHighlights[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [legal, plots, infra, amen, gated, investment] = await Promise.all([
          BaseCrudService.getAll<LegalApprovals>('legalapprovals'),
          BaseCrudService.getAll<PlotConfigurations>('plotconfigurations'),
          BaseCrudService.getAll<InfrastructureDetails>('infrastructuredetails'),
          BaseCrudService.getAll<ProjectAmenities>('projectamenities'),
          BaseCrudService.getAll<GatedLivingBenefits>('gatedlivingbenefits'),
          BaseCrudService.getAll<InvestmentHighlights>('investmenthighlights'),
        ]);

        setLegalApprovals(legal.items.filter(item => item.isVerified));
        setPlotConfigs(plots.items.sort((a, b) => (a.areaSqFt || 0) - (b.areaSqFt || 0)));
        setInfrastructure(infra.items.filter(item => item.isAvailable).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setAmenities(amen.items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setGatedBenefits(gated.items.filter(item => item.isActive).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        setInvestmentHighlights(investment.items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        // Hide loader after 3 seconds (after the loader animation completes)
        setTimeout(() => {
          setShowLoader(false);
        }, 3000);
      }
    };

    fetchData();
  }, []);

  // Auto-open contact form after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContactModalOpen(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-old-lace text-soft-charcoal min-h-screen overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {showLoader && <Loader />}
      
      <AnimatePresence>
        {!showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Header onOpenContactForm={() => setIsContactModalOpen(true)} />

            <ContactFormModal 
              isOpen={isContactModalOpen} 
              onClose={() => setIsContactModalOpen(false)} 
            />

            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <HeroSection onOpenContactForm={() => setIsContactModalOpen(true)} />
              <ProjectOverviewSection onOpenContactForm={() => setIsContactModalOpen(true)} />
              <PlotConfigurationsSection plotConfigs={plotConfigs} onOpenContactForm={() => setIsContactModalOpen(true)} />
              <LocationSection onOpenContactForm={() => setIsContactModalOpen(true)} />
              <InvestmentSection investmentHighlights={investmentHighlights} onOpenContactForm={() => setIsContactModalOpen(true)} />
              <Amenities3DSection amenities={amenities} />
              <GatedLivingSection gatedBenefits={gatedBenefits} onOpenContactForm={() => setIsContactModalOpen(true)} />
              <InfrastructureSection infrastructure={infrastructure} onOpenContactForm={() => setIsContactModalOpen(true)} />
              <LegalSection legalApprovals={legalApprovals} onOpenContactForm={() => setIsContactModalOpen(true)} />
              <FinalCTASection onOpenContactForm={() => setIsContactModalOpen(true)} />
              <Footer />
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sections ---

const HeroSection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden bg-old-lace"
    >
      <motion.div
        style={{ opacity }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen"
      >
        {/* LEFT: MASTERPLAN / IMAGE */}
        <div className="relative h-[50vh] sm:h-[55vh] lg:h-auto order-1 lg:order-1">
          <Image 
            src="https://static.wixstatic.com/media/cef78c_5c7ab11a07ad4474859427a981665a82~mv2.jpg" 
            alt="Meenakshi Pearl Aerial View - Gated Community" 
            className="absolute inset-0 w-full h-full object-cover" 
          />

          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent" />

          {/* Subtle brand mark */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white/80 text-[10px] sm:text-xs tracking-[0.3em] uppercase">
            Master Planned Community
          </div>
        </div>

        {/* RIGHT: CONTENT PANEL */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:px-16 xl:px-20 bg-white order-2 lg:order-2">
          <div className="max-w-xl w-full text-left">
            
            {/* Badge */}
            <CinematicReveal delay={0.2}>
              <span className="inline-block mb-4 sm:mb-6 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs tracking-widest uppercase font-medium">
                Premium Plotted Development
              </span>
            </CinematicReveal>

            {/* Heading */}
            <CinematicReveal delay={0.35}>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-soft-charcoal mb-4 sm:mb-6">
                Plots starting from{' '}
                <span className="text-primary whitespace-nowrap">
                  ₹40 Lakhs
                </span>
              </h1>
            </CinematicReveal>

            {/* Description */}
            <CinematicReveal delay={0.55}>
              <p className="font-paragraph text-sm sm:text-base md:text-lg lg:text-xl text-muted-gray leading-relaxed mb-6 sm:mb-8">
                Your gateway to luxury living in East of Bangalore.
                <br />
                A sanctuary of 212 premium plots across 14 acres.
                <br />
                <span className="text-primary font-semibold">
                  Grade-A Plotted Development
                </span>
              </p>
            </CinematicReveal>

            {/* Feature checklist (inspired by reference layout) */}
            <CinematicReveal delay={0.75}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 sm:gap-y-4 sm:gap-x-6 mb-8 sm:mb-10">
                {[
                  'Ready Infrastructure',
                  'Wide Internal Roads',
                  'Underground Utilities',
                  'Gated Community',
                  'Ready to register plots',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 sm:gap-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-soft-charcoal">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CinematicReveal>

            {/* CTA */}
            <CinematicReveal delay={0.95} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90
                           px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg
                           transition-all duration-500 hover:scale-105 w-full sm:w-auto"
                onClick={onOpenContactForm}
              >
                Schedule Visit
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary
                           hover:bg-pale-sage
                           px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg w-full sm:w-auto"
                onClick={() =>
                  document.getElementById('plots')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                View Masterplan
              </Button>
            </CinematicReveal>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-primary/70">
          Scroll
        </span>
        <motion.div
          animate={{ height: [18, 36, 18] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px bg-primary/60"
        />
      </motion.div>
    </section>
  
  );
};

const ProjectOverviewSection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  return (
    <section id="about" ref={ref} className="py-12 sm:py-20 md:py-36 bg-warm-beige relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-primary/15">
          {[
            { value: 14, label: "Acres of Land", suffix: "" },
            { value: 212, label: "Premium Plots", suffix: "" },
            { value: 100, label: "Vastu Compliant", suffix: "%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 text-center">
             <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 1, delay: i * 0.2 }}
  className="font-heading text-5xl sm:text-6xl md:text-8xl 
             font-semibold text-primary
             tracking-tight leading-none
             drop-shadow-[0_6px_20px_rgba(0,0,0,0.15)]
             mb-0"
>
  {stat.value}
  <span className="text-4xl sm:text-5xl md:text-7xl align-top ml-1">
    {stat.suffix}
  </span>
</motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                className="font-paragraph text-sm sm:text-lg md:text-xl text-soft-charcoal 
                           mt-[-0.5rem] sm:mt-4 
                           uppercase tracking-widest 
                           leading-tight sm:leading-normal"
              >
                {stat.label}
              </motion.p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 sm:mt-20 md:mt-32 text-center">
          <CinematicReveal>
            <p className="font-heading text-2xl sm:text-3xl md:text-5xl text-soft-charcoal max-w-4xl mx-auto leading-relaxed px-4 mb-8 sm:mb-12">
              "A meticulously planned ecosystem where luxury meets <span className="text-primary">legacy</span>. Every square foot is designed to appreciate in value and quality of life."
            </p>
          </CinematicReveal>
          
          <CinematicReveal delay={0.2}>
            <Button 
              onClick={onOpenContactForm}
              className="bg-primary text-white hover:bg-primary/90 font-paragraph text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              Learn More About Our Vision
            </Button>
          </CinematicReveal>
        </div>
      </div>
    </section>
  );
};

const LocationSection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  return (
    <section className="relative py-12 sm:py-20 md:py-36 bg-old-lace overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <CinematicReveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-primary/20 group cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => window.open('https://share.google/pDEnejBiRyZDm506a', '_blank')}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.7!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meenakshi Pearl Location Map"
                  className="opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 pointer-events-none border border-primary/10" />
                
                {/* Animated Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary rounded-full opacity-40"
                  />
                  <MapPin className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-primary relative z-10 drop-shadow-lg" fill="currentColor" />
                </div>
              </div>
            </CinematicReveal>
          </div>

          <div className="order-1 lg:order-2">
            <CinematicReveal>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal mb-6 sm:mb-8">
                Strategically <br />
                <span className="text-primary italic">Positioned</span>
              </h2>
            </CinematicReveal>
            
            <CinematicReveal delay={0.2}>
              <p className="font-paragraph text-sm sm:text-base md:text-lg text-muted-gray mb-8 sm:mb-12 leading-relaxed border-l-4 border-primary/30 pl-4 sm:pl-6">
                Located in the rapid-growth corridor of East Bangalore, Meenakshi Pearl offers the perfect equilibrium between urban connectivity and natural serenity.
              </p>
            </CinematicReveal>

            <div className="space-y-6 sm:space-y-8">
              {[
                { label: "Hoskote", dist: "20 mins" },
                { label: "Whitefield Tech Park", dist: "40 mins" },
                { label: "Intl. Airport", dist: "60 mins" }
              ].map((item, i) => (
                <CinematicReveal key={i} delay={0.3 + (i * 0.1)}>
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3 sm:pb-4 group hover:border-primary/30 transition-colors cursor-pointer" onClick={onOpenContactForm}>
                    <span className="font-heading text-lg sm:text-xl md:text-2xl text-soft-charcoal group-hover:translate-x-2 transition-transform duration-500">{item.label}</span>
                    <span className="font-paragraph text-primary font-semibold text-sm sm:text-base md:text-lg">{item.dist}</span>
                  </div>
                </CinematicReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfrastructureSection = ({ infrastructure, onOpenContactForm }: { infrastructure: InfrastructureDetails[], onOpenContactForm: () => void }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const itemWidth = 384;
  const gap = 32;
  const totalWidth = infrastructure.length * (itemWidth + gap);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-36 bg-warm-beige relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8">
        <div className="mb-16 sm:mb-24 md:mb-32">
          <CinematicReveal>
            <motion.h2 
              className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal mb-6 leading-tight"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              Infrastructure <span className="text-primary">Reimagined</span>
            </motion.h2>
          </CinematicReveal>
          
          <CinematicReveal delay={0.2}>
            <motion.p 
              className="font-paragraph text-sm sm:text-base md:text-lg text-muted-gray max-w-3xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              We don't just build roads and pipes; we engineer a seamless living experience. Every detail is executed to global standards.
            </motion.p>
          </CinematicReveal>
          
          <CinematicReveal delay={0.4}>
            <motion.div 
              className="w-20 sm:w-24 h-1 bg-primary mt-6 sm:mt-8"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            />
          </CinematicReveal>
        </div>

        <div className="relative overflow-hidden mb-8 sm:mb-12">
          <CinematicReveal delay={0.3}>
            <p className="font-paragraph text-xs uppercase tracking-widest text-primary mb-6 sm:mb-8">Featured Infrastructure</p>
          </CinematicReveal>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: [0, -totalWidth] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {infrastructure.map((item) => (
                <motion.div
                  key={item._id}
                  className="flex-shrink-0 w-72 sm:w-80 md:w-96 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-pale-sage/30 to-pale-sage/10 shadow-sm hover:shadow-md">
                    {item.featureIcon && (
                      <Image
                        src={item.featureIcon}
                        alt={item.featureName || "Feature"}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-old-lace via-old-lace/80 to-transparent">
                      <h4 className="font-heading text-lg sm:text-xl md:text-2xl text-soft-charcoal group-hover:text-primary transition-colors duration-300">
                        {item.featureName}
                      </h4>
                      <p className="font-paragraph text-xs sm:text-sm text-muted-gray mt-1.5 line-clamp-2">
                        {item.featureDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {infrastructure.map((item) => (
                <motion.div
                  key={`${item._id}-duplicate`}
                  className="flex-shrink-0 w-72 sm:w-80 md:w-96 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-pale-sage/30 to-pale-sage/10 shadow-sm hover:shadow-md">
                    {item.featureIcon && (
                      <Image
                        src={item.featureIcon}
                        alt={item.featureName || "Feature"}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-old-lace via-old-lace/80 to-transparent">
                      <h4 className="font-heading text-lg sm:text-xl md:text-2xl text-soft-charcoal group-hover:text-primary transition-colors duration-300">
                        {item.featureName}
                      </h4>
                      <p className="font-paragraph text-xs sm:text-sm text-muted-gray mt-1.5 line-clamp-2">
                        {item.featureDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <CinematicReveal delay={0.5}>
          <div className="mt-12 sm:mt-16 md:mt-20 text-center">
            <Button 
              onClick={onOpenContactForm}
              className="bg-primary text-white hover:bg-primary/90 font-paragraph text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              Explore Our Infrastructure
            </Button>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const GatedLivingSection = ({ gatedBenefits, onOpenContactForm }: { gatedBenefits: GatedLivingBenefits[], onOpenContactForm: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  if (!gatedBenefits || gatedBenefits.length === 0) {
    return null;
  }

  const currentBenefit = gatedBenefits[currentIndex];

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % gatedBenefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlay, gatedBenefits.length]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % gatedBenefits.length);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + gatedBenefits.length) % gatedBenefits.length);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative py-12 sm:py-20 md:py-36 bg-old-lace overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image 
          src="https://static.wixstatic.com/media/cef78c_f9065b5bb9c444d8956454710255821f~mv2.png?originWidth=1920&originHeight=1024"
          alt="Background Pattern"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-old-lace via-transparent to-old-lace" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <CinematicReveal>
            <div className="inline-flex items-center justify-center w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-full border border-primary/30 bg-pale-sage/40 mb-6 sm:mb-8">
              <Lock className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-primary" />
            </div>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-7xl text-soft-charcoal mb-4 sm:mb-6">Secure & Serene</h2>
          </CinematicReveal>
          <CinematicReveal delay={0.3}>
            <p className="font-paragraph text-sm sm:text-base md:text-xl text-muted-gray max-w-2xl mx-auto px-4">
              A sanctuary where privacy meets community. Experience the peace of mind that comes with premium gated living.
            </p>
          </CinematicReveal>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-12 sm:mb-16 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
            {/* Left Side - Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl shadow-lg border border-primary/10">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.5 },
                    }}
                    className="absolute inset-0"
                  >
                    {currentBenefit.benefitVisual && (
                      <Image
                        src={currentBenefit.benefitVisual}
                        alt={currentBenefit.benefitTitle || "Benefit"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Right Side - Text Content */}
            <div className="order-1 lg:order-2 flex flex-col justify-end lg:justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.5 },
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl text-soft-charcoal mb-4 sm:mb-6">
                      {currentBenefit.benefitTitle}
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <p className="font-paragraph text-sm sm:text-base md:text-lg text-muted-gray leading-relaxed mb-6 sm:mb-8">
                      {currentBenefit.benefitDescription}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <Button 
                      onClick={onOpenContactForm}
                      className="bg-primary text-white hover:bg-primary/90 font-paragraph text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary/30 hover:border-primary bg-old-lace hover:bg-pale-sage/40 flex items-center justify-center transition-all duration-300 group"
              aria-label="Previous benefit"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2 sm:gap-3">
              {gatedBenefits.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-3 h-3 sm:w-4 sm:h-4 bg-primary'
                      : 'w-2 h-2 sm:w-3 sm:h-3 bg-primary/30 hover:bg-primary/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to benefit ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary/30 hover:border-primary bg-old-lace hover:bg-pale-sage/40 flex items-center justify-center transition-all duration-300 group"
              aria-label="Next benefit"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Counter */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="font-paragraph text-xs sm:text-sm text-muted-gray uppercase tracking-widest">
              {currentIndex + 1} <span className="text-primary/50">of</span> {gatedBenefits.length}
            </p>
          </div>
        </div>

        <CinematicReveal delay={0.6}>
          <div className="text-center">
            <Button 
              onClick={onOpenContactForm}
              className="bg-primary text-white hover:bg-primary/90 font-paragraph text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg tracking-wide transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              Discover All Gated Living Benefits
            </Button>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const PlotConfigurationsSection = ({ plotConfigs, onOpenContactForm }: { plotConfigs: PlotConfigurations[], onOpenContactForm: () => void }) => {
  const configCards = [
    { 
      title: "1500 Sqft", 
      subtitle: "30x50", 
      description: "Perfect for modern family homes",
      image: "https://static.wixstatic.com/media/cef78c_1ed0e26987f94f4da1faa6988026c93d~mv2.png?originWidth=1152&originHeight=768",
    },
    { 
      title: "1800 Sqft", 
      subtitle: "30x60", 
      description: "Premium luxury residences",
      image: "https://static.wixstatic.com/media/cef78c_3afbc2ed677e4695a734f9bc4f870313~mv2.png?originWidth=1152&originHeight=768",
    },
    { 
      title: "Custom Plots", 
      subtitle: "Bespoke Sizes", 
      description: "Exclusive architectural designs",
      image: "https://static.wixstatic.com/media/cef78c_3dec255cbbec4e8e8c3a0710bcec325c~mv2.png?originWidth=1152&originHeight=768",
    }
  ];

  return (
    <section id="plots" className="py-10 sm:py-14 md:py-20 bg-warm-beige relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <CinematicReveal>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal mb-3 sm:mb-4">
              Plot <span className="text-primary">Configurations</span>
            </h2>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <p className="font-paragraph text-base sm:text-lg md:text-xl text-muted-gray max-w-2xl mx-auto px-4">
              Choose from our thoughtfully designed plot options
            </p>
          </CinematicReveal>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-14">
          {configCards.map((card, index) => (
            <CinematicReveal key={index} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-full flex flex-col overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-48 sm:h-56 md:h-72 overflow-hidden bg-pale-sage/20">
                  {/* Available Badge at Top */}
                  <div className="absolute top-4 left-4 z-10 bg-primary/90 text-white px-3 py-1.5 rounded-lg">
                    <span className="font-paragraph text-xs sm:text-sm uppercase tracking-wider font-medium">
                      Available
                    </span>
                  </div>
                  
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="relative flex-1 flex flex-col justify-between p-5 sm:p-6 md:p-7 bg-old-lace border border-primary/10">
                  <div>
                    <p className="font-paragraph text-primary text-lg sm:text-xl md:text-2xl uppercase tracking-wide mb-3 font-semibold">
                      {card.subtitle}
                    </p>
                    <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-soft-charcoal mb-2 group-hover:text-primary transition-colors duration-500">
                      {card.title}
                    </h3>
                    <p className="font-paragraph text-sm sm:text-base md:text-lg text-muted-gray leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </CinematicReveal>
          ))}
        </div>



        <CinematicReveal delay={0.7}>
          <div className="text-center">
            <Button 
              onClick={onOpenContactForm}
              className="bg-primary text-white hover:bg-primary/90 
                         font-paragraph text-base sm:text-lg 
                         px-8 sm:px-10 py-3 sm:py-4 
                         rounded-xl tracking-wide 
                         transition-all duration-300 
                         hover:scale-105 shadow-md hover:shadow-lg"
            >
              Reserve Your Plot Today
            </Button>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const LegalSection = ({ legalApprovals, onOpenContactForm }: { legalApprovals: LegalApprovals[], onOpenContactForm: () => void }) => {
  // Helper function to replace BDA with MPA and Bangalore with Malur
  const replaceText = (text?: string) => {
    if (!text) return text;
    return text
      .replace(/\bBDA\b/g, 'MPA')
      .replace(/\bBangalore\b/gi, 'Malur');
  };

  return (
    <section className="pt-12 sm:pt-20 md:pt-36 bg-old-lace relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-primary/5 rounded-full opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 md:mb-24 gap-6 sm:gap-8">
          <div className="max-w-2xl">
            <CinematicReveal>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal mb-6 leading-tight">
               What{' '}
             <span className="text-primary">Meenakshi</span>
              <br />
              Delivers to you ?
             </h2>
           </CinematicReveal>

            <CinematicReveal delay={0.2}>
              <p className="font-paragraph text-sm sm:text-base md:text-lg text-muted-gray">
                Your investment is secured by comprehensive legal approvals and clear titles. We believe trust is the ultimate luxury.
              </p>
            </CinematicReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-12 sm:mb-16 md:mb-20">
          {legalApprovals.map((approval, index) => (
            <CinematicReveal key={approval._id} delay={index * 0.1}>
              <div className="group relative p-6 sm:p-7 md:p-8 border border-primary/15 bg-warm-beige/50 hover:bg-warm-beige transition-all duration-500 h-full flex flex-col rounded-xl shadow-sm hover:shadow-md">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                
                <div className="mb-4 sm:mb-6 flex justify-between items-start">
                  <div className="p-2 sm:p-3 bg-pale-sage/40 rounded-lg text-primary group-hover:scale-110 transition-transform duration-500">
                    <Check className="w-5 sm:w-6 h-5 sm:h-6" />
                  </div>
                  {approval.approvalDate && (
                    <span className="text-xs text-muted-gray font-mono">
                      {new Date(approval.approvalDate).getFullYear()}
                    </span>
                  )}
                </div>
                
                <h3 className="font-heading text-lg sm:text-2xl md:text-3xl text-soft-charcoal mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {replaceText(approval.approvalName)}
                </h3>
                <p className="font-paragraph text-xs sm:text-sm text-muted-gray leading-relaxed mb-3 sm:mb-4 flex-grow">
                  {replaceText(approval.description)}
                </p>
                
                {approval.issuingAuthority && (
                  <div className="pt-3 sm:pt-4 border-t border-primary/10 mt-auto">
                    <p className="text-[10px] sm:text-xs text-primary/70 uppercase tracking-wider">
                      {replaceText(approval.issuingAuthority)}
                    </p>
                  </div>
                )}
              </div>
            </CinematicReveal>
          ))}
        </div>

        <CinematicReveal delay={0.5}>
          <div className="text-center">
            
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const InvestmentSection = ({ investmentHighlights, onOpenContactForm }: { investmentHighlights: InvestmentHighlights[], onOpenContactForm: () => void }) => {
  const sectionRef = useRef(null);

  // Icon mapping for each investment highlight
  const iconMap = [
    { Icon: Target, gradient: "from-primary/20 to-primary/5" },
    { Icon: BarChart3, gradient: "from-primary/15 to-primary/10" },
    { Icon: Shield, gradient: "from-primary/25 to-primary/5" },
    { Icon: Zap, gradient: "from-primary/20 to-primary/10" },
    { Icon: Award, gradient: "from-primary/15 to-primary/5" },
    { Icon: Sparkles, gradient: "from-primary/20 to-primary/5" },
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-36 bg-gradient-to-br from-warm-beige via-old-lace to-warm-beige relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] bg-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] md:w-[600px] h-[250px] sm:h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <CinematicReveal>
            <motion.div 
              className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-6 sm:mb-8 border-2 border-primary/20"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <TrendingUp className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-primary" />
            </motion.div>
          </CinematicReveal>

          <CinematicReveal delay={0.15}>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal mb-4 sm:mb-6 leading-tight">
              The Investment <br />
              <span className="text-primary italic">Advantage</span>
            </h2>
          </CinematicReveal>

          <CinematicReveal delay={0.25}>
            <p className="font-paragraph text-sm sm:text-base md:text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed px-4">
              Discover why Meenakshi Pearl stands out as the premier investment opportunity in East Bangalore's growth corridor
            </p>
          </CinematicReveal>

          <CinematicReveal delay={0.35}>
            <motion.div 
              className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6 sm:mt-8"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </CinematicReveal>
        </div>

        {/* Investment Highlights Grid - 2x2 Layout */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-12 sm:mb-16 md:mb-20 max-w-7xl mx-auto">
          {investmentHighlights.slice(0, 4).map((highlight, index) => {
            const { Icon, gradient } = iconMap[index % iconMap.length];
            
            return (
              <CinematicReveal key={highlight._id} delay={index * 0.1}>
                <motion.div
                  className="group relative h-full"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Card Container */}
                  <div className="relative h-full bg-old-lace border-2 border-primary/15 rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Animated Pattern Background */}
                    <motion.div 
                      className="absolute inset-0 opacity-5"
                      initial={{ backgroundPosition: '0% 0%' }}
                      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                      transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                      style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                    />
                    
                    {/* Top Border Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon Container with Glow Effect */}
                      <motion.div 
                        className={`relative w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-2xl bg-gradient-to-br ${gradient} border-2 border-primary/30 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                        whileHover={{ rotate: 12 }}
                      >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Icon className="relative w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-primary drop-shadow-lg" />
                      </motion.div>

                      {/* Title */}
                      <h3 className="font-heading text-base sm:text-xl md:text-2xl lg:text-3xl text-soft-charcoal mb-2 sm:mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {highlight.highlightTitle}
                      </h3>

                      {/* Quote */}
                      {highlight.highlightQuote && (
                        <p className="font-paragraph text-xs sm:text-sm md:text-base lg:text-lg text-muted-gray mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                          {highlight.highlightQuote}
                        </p>
                      )}

                      {/* Additional Context */}
                      {highlight.additionalContext && (
                        <p className="font-paragraph text-[10px] sm:text-xs md:text-sm text-muted-gray leading-relaxed group-hover:text-soft-charcoal/70 transition-colors duration-300">
                          {highlight.additionalContext}
                        </p>
                      )}

                      {/* Decorative Corner Element */}
                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-500" />
                      
                      {/* Decorative Top Left Corner */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>

                  {/* Animated Shine Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      backgroundSize: '200% 200%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                </motion.div>
              </CinematicReveal>
            );
          })}
        </div>

        {/* Stats Bar */}
        <CinematicReveal delay={0.5}>
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 md:p-10 mb-12 sm:mb-16 border border-primary/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-primary/20">
              {[
                { value: "25%+", label: "Expected Appreciation", sublabel: "in 3-5 years" },
                { value: "100%", label: "Clear Title", sublabel: "Legal Compliance" },
                { value: "₹40L", label: "Starting Price", sublabel: "Premium Plots" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="text-center py-4 sm:py-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (i * 0.1) }}
                  viewport={{ once: true }}
                >
                  <div className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="font-paragraph text-sm sm:text-base text-soft-charcoal font-semibold mb-1">
                    {stat.label}
                  </div>
                  <div className="font-paragraph text-xs sm:text-sm text-muted-gray">
                    {stat.sublabel}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CinematicReveal>

        {/* CTA Section */}
        <CinematicReveal delay={0.7}>
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onOpenContactForm}
                className="bg-primary text-white hover:bg-primary/90 font-paragraph text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-xl tracking-wide transition-all duration-300 shadow-lg hover:shadow-2xl group"
              >
                <span className="flex items-center gap-2">
                  Explore Investment Opportunities
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </motion.div>
            
            <p className="font-paragraph text-xs sm:text-sm text-muted-gray mt-4 sm:mt-6">
              Limited plots available • Book your site visit today
            </p>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const FinalCTASection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    phoneNumber: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const isEnglishOnly = (text: string): boolean => {
    // Allow only English letters, numbers, spaces, and common punctuation
    const englishRegex = /^[a-zA-Z0-9\s.,!?'\"-]*$/;
    return englishRegex.test(text);
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply restrictions only to message field
    if (name === 'message') {
      // Check if input is English only
      if (!isEnglishOnly(value)) {
        return;
      }
      
      // Check word limit (10 words max)
      if (countWords(value) > 10) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await BaseCrudService.create('contactformsubmissions', {
        _id: crypto.randomUUID(),
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        submissionDate: new Date(),
      });

      setSubmitSuccess(true);
      setFormData({ name: '', phoneNumber: '', email: '' });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="own-legacy" className="relative py-12 sm:py-20 md:py-36 bg-old-lace overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-primary/5 rounded-full opacity-15 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <CinematicReveal>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-8xl text-primary mb-6 sm:mb-8 tracking-tight">
              <span className="whitespace-nowrap">Own the legacy</span>
            </h2>
          </CinematicReveal>

          <CinematicReveal delay={0.2}>
            <p className="font-paragraph text-sm sm:text-base md:text-xl text-muted-gray max-w-2xl mx-auto mb-8 sm:mb-12 font-light px-4">
              Limited plots available. Secure your piece of East Bangalore's finest address today.
            </p>
          </CinematicReveal>
        </div>

        {/* Contact Form */}
        <CinematicReveal delay={0.3}>
          <div className="max-w-3xl mx-auto bg-warm-beige border border-primary/15 rounded-2xl p-6 sm:p-10 md:p-16 mb-8 sm:mb-12">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-pale-sage/40 border border-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Check className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl text-soft-charcoal mb-2 sm:mb-3">Thank You!</h3>
                <p className="font-paragraph text-sm sm:text-base md:text-lg text-muted-gray">
                  We've received your message. Our team will be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                  {/* Name */}
                  <div>
                    <label className="block font-paragraph text-xs sm:text-sm text-soft-charcoal/90 mb-2 sm:mb-3 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-old-lace border border-primary/20 rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-paragraph text-sm sm:text-base text-soft-charcoal placeholder-muted-gray/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-paragraph text-xs sm:text-sm text-soft-charcoal/90 mb-2 sm:mb-3 font-semibold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full bg-old-lace border border-primary/20 rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-paragraph text-sm sm:text-base text-soft-charcoal placeholder-muted-gray/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-paragraph text-xs sm:text-sm text-soft-charcoal/90 mb-2 sm:mb-3 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-old-lace border border-primary/20 rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-paragraph text-sm sm:text-base text-soft-charcoal placeholder-muted-gray/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white hover:bg-primary/90 font-paragraph text-sm sm:text-base md:text-lg py-2.5 sm:py-3 md:py-4 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>

                <p className="font-paragraph text-[10px] sm:text-xs md:text-sm text-muted-gray text-center">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            )}
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};
