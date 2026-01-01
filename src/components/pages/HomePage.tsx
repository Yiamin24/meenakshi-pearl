// HPI 1.5-V
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
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
import { MapPin, Phone, Mail, ArrowRight, Check, Lock, TrendingUp } from 'lucide-react';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';
import Amenities3DSection from '@/components/Amenities3DCard';
import ContactFormModal from '@/components/ContactFormModal';


// --- Utility Components ---

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

const CinematicReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const ParallaxText = ({ children, className = "", speed = 1 }: { children: React.ReactNode, className?: string, speed?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// --- Main Component ---

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [legalApprovals, setLegalApprovals] = useState<LegalApprovals[]>([]);
  const [plotConfigs, setPlotConfigs] = useState<PlotConfigurations[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureDetails[]>([]);
  const [amenities, setAmenities] = useState<ProjectAmenities[]>([]);
  const [gatedBenefits, setGatedBenefits] = useState<GatedLivingBenefits[]>([]);
  const [investmentHighlights, setInvestmentHighlights] = useState<InvestmentHighlights[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
        // Minimum load time to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
          setShowVideo(true);
        }, 2500);
      }
    };

    fetchData();
  }, []);

  // Open contact form 5 seconds after video ends and hero section is visible
  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        setIsContactModalOpen(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [videoEnded]);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Cinematic Noise Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loader"
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200]"
          >
            <Loader />
          </motion.div>
        ) : showVideo && !videoEnded ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-[150] bg-black flex items-center justify-center"
          >
            <video
              autoPlay
              muted
              playsInline
              onEnded={() => setVideoEnded(true)}
              className="w-full h-full object-contain"
            >
              <source src="https://video.wixstatic.com/video/cef78c_3fdbf53a388748deb2e7bb1354e2faca/720p/mp4/file.mp4" type="video/mp4" />
            </video>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <HeroSection onOpenContactForm={() => setIsContactModalOpen(true)} />
            <ProjectOverviewSection />
            <InfrastructureSection infrastructure={infrastructure} />
            <GatedLivingSection gatedBenefits={gatedBenefits} />
            <Amenities3DSection amenities={amenities} />
            <LocationSection onOpenContactForm={() => setIsContactModalOpen(true)} />
            <PlotConfigurationsSection plotConfigs={plotConfigs} />
            <LegalSection legalApprovals={legalApprovals} />
            <InvestmentSection investmentHighlights={investmentHighlights} />
            <FinalCTASection onOpenContactForm={() => setIsContactModalOpen(true)} />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sections ---

const HeroSection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <Image
          src="https://static.wixstatic.com/media/cef78c_272ae46537a349c4a4a5b74d1d886332~mv2.png?originWidth=1920&originHeight=1024"
          alt="Meenakshi Pearl Aerial View"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 md:px-8 text-center">
        <CinematicReveal delay={0.1}>
          <Image
            src="https://static.wixstatic.com/media/cef78c_c6d8a435aea5404b8ab01167c045f18b~mv2.png"
            alt="Meenakshi Pearl Logo"
            width={400}
            height={140}
            className="mx-auto mb-8 drop-shadow-[0_0_30px_rgba(184,134,11,0.6)]"
          />
        </CinematicReveal>
        
        <CinematicReveal delay={0.3}>
          <span className="inline-block py-1 px-3 border border-primary/50 rounded-full bg-black/30 backdrop-blur-md text-primary text-xs md:text-sm tracking-[0.2em] uppercase mb-6">
            Grade-A Plotted Development
          </span>
        </CinematicReveal>

        <CinematicReveal delay={0.6}>
          <p className="font-paragraph text-lg md:text-2xl text-champagne-beige/90 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Your gateway to luxury living in the heart of East Bangalore. <br className="hidden md:block" />
            A sanctuary of 212 premium plots across 14 acres.
          </p>
        </CinematicReveal>

        <CinematicReveal delay={0.8} className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Button 
            size="lg" 
            className="bg-primary text-black hover:bg-primary/90 font-paragraph text-lg px-10 py-8 rounded-none min-w-[200px] tracking-wide transition-all duration-500 hover:scale-105"
            onClick={onOpenContactForm}
          >
            Schedule Visit
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-pearl-ivory text-pearl-ivory hover:bg-pearl-ivory hover:text-black font-paragraph text-lg px-10 py-8 rounded-none min-w-[200px] tracking-wide backdrop-blur-sm transition-all duration-500"
            onClick={() => document.getElementById('plots')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Masterplan
          </Button>
        </CinematicReveal>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary/80">Scroll to Explore</span>
        <motion.div 
          animate={{ height: [20, 40, 20] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] bg-primary/50"
        />
      </motion.div>
    </section>
  );
};

const LocationSection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <CinematicReveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 group cursor-pointer" onClick={() => window.open('https://share.google/pDEnejBiRyZDm506a', '_blank')}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.7!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(85%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meenakshi Pearl Location Map"
                  className="opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 pointer-events-none border border-primary/20" />
                
                {/* Animated Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary rounded-full blur-xl"
                  />
                  <MapPin className="w-12 h-12 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(184,134,11,0.8)]" fill="currentColor" />
                </div>
              </div>
            </CinematicReveal>
          </div>

          <div className="order-1 lg:order-2">
            <CinematicReveal>
              <h2 className="font-heading text-4xl md:text-6xl text-pearl-ivory mb-8">
                Strategically <br />
                <span className="text-primary italic">Positioned</span>
              </h2>
            </CinematicReveal>
            
            <CinematicReveal delay={0.2}>
              <p className="font-paragraph text-lg text-champagne-beige/80 mb-12 leading-relaxed border-l-2 border-primary/30 pl-6">
                Located in the rapid-growth corridor of East Bangalore, Meenakshi Pearl offers the perfect equilibrium between urban connectivity and natural serenity.
              </p>
            </CinematicReveal>

            <div className="space-y-8">
              {[
                { label: "Sarjapur Main Road", dist: "5 km" },
                { label: "Electronic City", dist: "8 km" },
                { label: "Whitefield Tech Park", dist: "12 km" },
                { label: "Intl. Airport", dist: "45 mins" }
              ].map((item, i) => (
                <CinematicReveal key={i} delay={0.3 + (i * 0.1)}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 group hover:border-primary/50 transition-colors cursor-pointer" onClick={onOpenContactForm}>
                    <span className="font-heading text-xl text-pearl-ivory group-hover:translate-x-2 transition-transform duration-500">{item.label}</span>
                    <span className="font-paragraph text-primary font-medium">{item.dist}</span>
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

const ProjectOverviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  return (
    <section ref={ref} className="py-32 bg-champagne-beige/5 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-primary/20">
          {[
            { value: 14, label: "Acres of Land", suffix: "" },
            { value: 212, label: "Premium Plots", suffix: "" },
            { value: 100, label: "Vastu Compliant", suffix: "%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="font-heading text-7xl md:text-8xl lg:text-9xl text-primary/20 font-bold relative"
              >
                <span className="absolute inset-0 text-primary blur-2xl opacity-30">{stat.value}</span>
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/40">
                  {stat.value}{stat.suffix}
                </span>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                className="font-paragraph text-xl text-pearl-ivory mt-4 uppercase tracking-widest"
              >
                {stat.label}
              </motion.p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <CinematicReveal>
            <p className="font-heading text-3xl md:text-4xl text-champagne-beige max-w-4xl mx-auto leading-normal">
              "A meticulously planned ecosystem where <span className="text-primary">luxury meets legacy</span>. Every square foot is designed to appreciate in value and quality of life."
            </p>
          </CinematicReveal>
        </div>
      </div>
    </section>
  );
};

const LegalSection = ({ legalApprovals }: { legalApprovals: LegalApprovals[] }) => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <CinematicReveal>
              <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-6">
                Uncompromising <br />
                <span className="text-primary">Transparency</span>
              </h2>
            </CinematicReveal>
            <CinematicReveal delay={0.2}>
              <p className="font-paragraph text-lg text-champagne-beige/70">
                Your investment is secured by comprehensive legal approvals and clear titles. We believe trust is the ultimate luxury.
              </p>
            </CinematicReveal>
          </div>
          <CinematicReveal delay={0.3}>
            <div className="flex items-center gap-2 text-primary border border-primary/30 px-6 py-3 rounded-full bg-primary/5">
              <Check className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm font-medium">RERA Approved</span>
            </div>
          </CinematicReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalApprovals.map((approval, index) => (
            <CinematicReveal key={approval._id} delay={index * 0.1}>
              <div className="group relative p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform duration-500">
                    <Check className="w-6 h-6" />
                  </div>
                  {approval.approvalDate && (
                    <span className="text-xs text-white/30 font-mono">
                      {new Date(approval.approvalDate).getFullYear()}
                    </span>
                  )}
                </div>
                
                <h3 className="font-heading text-2xl text-pearl-ivory mb-3 group-hover:text-primary transition-colors">
                  {approval.approvalName}
                </h3>
                <p className="font-paragraph text-sm text-champagne-beige/60 leading-relaxed mb-4 flex-grow">
                  {approval.description}
                </p>
                
                {approval.issuingAuthority && (
                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <p className="text-xs text-primary/80 uppercase tracking-wider">
                      {approval.issuingAuthority}
                    </p>
                  </div>
                )}
              </div>
            </CinematicReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlotConfigurationsSection = ({ plotConfigs }: { plotConfigs: PlotConfigurations[] }) => {
  const configCards = [
    { title: "🏡 1500 Sqft", subtitle: "(30x50)", description: "Perfect for modern family homes with spacious layouts" },
    { title: "🏡 1800 Sqft", subtitle: "(30x60)", description: "Premium configurations for luxury residences" },
    { title: "🏡 Larger Premium Plots", subtitle: "Available", description: "Custom sizes for exclusive architectural designs" }
  ];

  return (
    <section id="plots" className="pt-0 pb-32 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <SectionDivider />
        
        <div className="text-center mb-24">
          <CinematicReveal>
            <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-6">
              Plot <span className="text-primary">Configurations</span>
            </h2>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <p className="font-paragraph text-lg text-champagne-beige/70 max-w-3xl mx-auto">
              Discover our thoughtfully designed plot options, each crafted to inspire your dream home. From contemporary to classical, find your perfect canvas.
            </p>
          </CinematicReveal>
        </div>

        {/* Configuration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {configCards.map((card, index) => (
            <CinematicReveal key={index} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(184, 134, 11, 0.15)" }}
                className="group relative h-full"
              >
                {/* Card Background with Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] border border-primary/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content */}
                <div className="relative p-10 h-full flex flex-col justify-between">
                  {/* Top Section */}
                  <div>
                    {/* Icon/Number Background */}
                    <div className="mb-8 relative">
                      <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                      <div className="relative z-10">
                        <h3 className="font-heading text-4xl md:text-5xl text-pearl-ivory mb-2 group-hover:text-primary transition-colors duration-500">
                          {card.title}
                        </h3>
                        <p className="font-paragraph text-primary text-lg font-medium">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-paragraph text-champagne-beige/70 text-base leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-10 pt-8 border-t border-primary/10 group-hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-paragraph text-primary text-sm uppercase tracking-widest font-medium">
                        Learn More
                      </span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Hover Border Animation */}
                <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/50 transition-all duration-700 pointer-events-none" />
              </motion.div>
            </CinematicReveal>
          ))}
        </div>

        {/* Additional Info Section */}
        <CinematicReveal delay={0.5}>
          <div className="relative mt-20 p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-lg">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { number: "212", label: "Total Plots Available" },
                { number: "14", label: "Acres of Premium Land" },
                { number: "100%", label: "Vastu Compliant Designs" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <p className="font-heading text-5xl text-primary mb-2">{stat.number}</p>
                  <p className="font-paragraph text-champagne-beige/70 text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const InfrastructureSection = ({ infrastructure }: { infrastructure: InfrastructureDetails[] }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // Calculate carousel width dynamically
  const itemWidth = 384; // w-96 = 384px
  const gap = 32; // md:gap-8 = 32px
  const totalWidth = infrastructure.length * (itemWidth + gap);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <CinematicReveal>
            <motion.h2 
              className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-6 leading-tight"
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
              className="font-paragraph text-lg md:text-xl text-champagne-beige/80 max-w-3xl"
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
              className="w-24 h-1 bg-primary mt-8"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            />
          </CinematicReveal>
        </div>

        {/* Optimized Infinite Carousel */}
        <div className="relative overflow-hidden mb-8">
          <CinematicReveal delay={0.3}>
            <p className="font-paragraph text-sm uppercase tracking-widest text-primary mb-8">Featured Infrastructure</p>
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
              {/* Single set of items - carousel handles infinite loop */}
              {infrastructure.map((item) => (
                <motion.div
                  key={item._id}
                  className="flex-shrink-0 w-80 md:w-96 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 md:h-72 rounded-xl overflow-hidden border border-primary/30 group-hover:border-primary/70 transition-all duration-500 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                    {item.featureIcon && (
                      <Image
                        src={item.featureIcon}
                        alt={item.featureName || "Feature"}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="font-heading text-xl md:text-2xl text-pearl-ivory group-hover:text-primary transition-colors duration-300">
                        {item.featureName}
                      </h4>
                      <p className="font-paragraph text-xs md:text-sm text-champagne-beige/70 mt-2 line-clamp-2">
                        {item.featureDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Seamless loop - duplicate items */}
              {infrastructure.map((item) => (
                <motion.div
                  key={`${item._id}-duplicate`}
                  className="flex-shrink-0 w-80 md:w-96 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 md:h-72 rounded-xl overflow-hidden border border-primary/30 group-hover:border-primary/70 transition-all duration-500 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                    {item.featureIcon && (
                      <Image
                        src={item.featureIcon}
                        alt={item.featureName || "Feature"}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="font-heading text-xl md:text-2xl text-pearl-ivory group-hover:text-primary transition-colors duration-300">
                        {item.featureName}
                      </h4>
                      <p className="font-paragraph text-xs md:text-sm text-champagne-beige/70 mt-2 line-clamp-2">
                        {item.featureDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          className="border-t border-primary/20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">{infrastructure.length}+</div>
            <p className="font-paragraph text-sm text-champagne-beige/60">Premium Features</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">100%</div>
            <p className="font-paragraph text-sm text-champagne-beige/60">Global Standards</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">24/7</div>
            <p className="font-paragraph text-sm text-champagne-beige/60">Maintenance</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">∞</div>
            <p className="font-paragraph text-sm text-champagne-beige/60">Durability</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AmenitiesSection = ({ amenities }: { amenities: ProjectAmenities[] }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  
  const { scrollYProgress: sectionProgress } = useScroll({ target: sectionRef });
  const { scrollYProgress: carouselProgress } = useScroll({ target: carouselRef });
  
  // Calculate scroll distance needed to show all cards
  const itemWidth = 600; // md:w-[600px]
  const gap = 64; // md:gap-16
  const totalScrollDistance = amenities.length * (itemWidth + gap);
  
  const x = useTransform(carouselProgress, [0, 1], ["0%", `-${totalScrollDistance}px`]);
  
  // Sticky header logic: stick at 20% from top, release when last card is visible
  const headerY = useTransform(sectionProgress, [0, 0.3, 1], [0, 0, 0]);
  const headerOpacity = useTransform(sectionProgress, [0.85, 1], [1, 0]);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-20 bg-champagne-beige/5">
      <div className="container mx-auto px-4 md:px-8">
        {/* Sticky Header */}
        <motion.div 
          ref={headerRef}
          style={{ y: headerY, opacity: headerOpacity }}
          className="sticky top-[20%] z-20 mb-12 md:mb-16 flex justify-between items-end pb-8 border-b border-primary/20"
        >
          <div>
            <CinematicReveal>
              <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-4">The Collection</h2>
            </CinematicReveal>
            <CinematicReveal delay={0.1}>
              <p className="font-paragraph text-primary uppercase tracking-widest text-sm\">World-Class Amenities</p>
            </CinematicReveal>
          </div>
          <CinematicReveal delay={0.2} className="hidden md:flex items-center gap-4 text-white/30">
            <span>Scroll to Explore</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </CinematicReveal>
        </motion.div>

        {/* Carousel Container */}
        <div ref={carouselRef} className="relative overflow-hidden -mx-4 md:-mx-8 px-4 md:px-8">
          <motion.div style={{ x }} className="flex gap-8 md:gap-16 w-max">
            {amenities.map((amenity, index) => (
              <div 
                key={amenity._id} 
                className="relative w-[85vw] md:w-[600px] aspect-[16/9] md:aspect-[4/3] flex-shrink-0 group"
              >
                <div className="absolute inset-0 overflow-hidden rounded-sm">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10\" />
                  {amenity.galleryImage && (
                    <Image
                      src={amenity.galleryImage}
                      alt={amenity.amenityName || "Amenity"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  )}
                </div>
                
                <motion.div 
                  className="absolute -bottom-20 left-0 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-baseline justify-between border-b border-white/20 pb-4">
                    <h3 className="font-heading text-3xl md:text-4xl text-pearl-ivory group-hover:text-primary transition-colors duration-300">
                      {amenity.amenityName}
                    </h3>
                    <span className="font-mono text-primary/50 text-xl\">0{index + 1}</span>
                  </div>
                  <p className="font-paragraph text-sm text-champagne-beige/60 mt-4 max-w-md line-clamp-2">
                    {amenity.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-champagne-beige/5 to-transparent z-10 pointer-events-none\" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-champagne-beige/5 to-transparent z-10 pointer-events-none\" />
        </div>

        {/* Bottom Spacing */}
        <div className="mt-32 md:mt-40" />
      </div>
    </section>
  );
};

const GatedLivingSection = ({ gatedBenefits }: { gatedBenefits: GatedLivingBenefits[] }) => {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 opacity-20">
        <Image 
          src="https://static.wixstatic.com/media/cef78c_f9065b5bb9c444d8956454710255821f~mv2.png?originWidth=1920&originHeight=1024"
          alt="Background Pattern"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-24">
          <CinematicReveal>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-6">Secure & Serene</h2>
          </CinematicReveal>
          <CinematicReveal delay={0.3}>
            <p className="font-paragraph text-lg text-champagne-beige/70 max-w-2xl mx-auto">
              A sanctuary where privacy meets community. Experience the peace of mind that comes with premium gated living.
            </p>
          </CinematicReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {gatedBenefits.map((benefit, index) => (
            <CinematicReveal key={benefit._id} delay={index * 0.2}>
              <div className="flex gap-8 items-start group">
                <div className="w-1/3 overflow-hidden rounded-sm aspect-[4/5]">
                  {benefit.benefitVisual && (
                    <Image
                      src={benefit.benefitVisual}
                      alt={benefit.benefitTitle || "Benefit"}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  )}
                </div>
                <div className="w-2/3 pt-4">
                  <h3 className="font-heading text-3xl text-pearl-ivory mb-4 group-hover:text-primary transition-colors">
                    {benefit.benefitTitle}
                  </h3>
                  <p className="font-paragraph text-champagne-beige/60 leading-relaxed">
                    {benefit.benefitDescription}
                  </p>
                </div>
              </div>
            </CinematicReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const InvestmentSection = ({ investmentHighlights }: { investmentHighlights: InvestmentHighlights[] }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  return (
    <section ref={sectionRef} className="py-32 bg-champagne-beige/5 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-primary/20 pb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CinematicReveal>
            <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory">
              The Investment <br />
              <span className="text-primary">Advantage</span>
            </h2>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <div className="flex items-center gap-3 text-white/50 mt-6 md:mt-0">
              <TrendingUp className="w-6 h-6" />
              <span className="uppercase tracking-widest text-sm">High Appreciation Potential</span>
            </div>
          </CinematicReveal>
        </motion.div>

        {/* Right-to-Left Scroll Animation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {investmentHighlights.map((highlight, index) => {
            const itemRef = useRef(null);
            const { scrollYProgress: itemProgress } = useScroll({ 
              target: itemRef, 
              offset: ["start 80%", "start 20%"] 
            });
            
            // Right-to-left animation: starts from right (100px), ends at left (0px)
            const x = useTransform(itemProgress, [0, 1], [100, 0]);
            const opacity = useTransform(itemProgress, [0, 0.5], [0, 1]);

            return (
              <motion.div
                key={highlight._id}
                ref={itemRef}
                style={{ x, opacity }}
                className="relative pl-8 border-l border-white/10 hover:border-primary transition-colors duration-500 group"
              >
                {/* Animated accent line */}
                <motion.div 
                  className="absolute -left-[1px] top-0 w-[1px] bg-gradient-to-b from-primary to-transparent"
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  transition={{ duration: 1.2, delay: index * 0.15 }}
                  viewport={{ once: false }}
                />

                <motion.h3 
                  className="font-heading text-3xl text-pearl-ivory mb-6 group-hover:text-primary transition-colors duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: false }}
                >
                  {highlight.highlightTitle}
                </motion.h3>
                
                {highlight.highlightQuote && (
                  <motion.blockquote 
                    className="font-heading text-xl md:text-2xl text-champagne-beige italic mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
                    viewport={{ once: false }}
                  >
                    "{highlight.highlightQuote.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.05) }}
                        viewport={{ once: false }}
                        className={highlight.emphasizedPhrase?.includes(word) ? "text-primary border-b border-primary" : ""}
                      >
                        {word}{" "}
                      </motion.span>
                    ))}"
                  </motion.blockquote>
                )}

                {highlight.additionalContext && (
                  <motion.p 
                    className="font-paragraph text-sm text-white/40 group-hover:text-white/60 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                    viewport={{ once: false }}
                  >
                    {highlight.additionalContext}
                  </motion.p>
                )}

                {/* Hover accent indicator */}
                <motion.div 
                  className="absolute -left-3 top-0 w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: false }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="mt-20 h-[1px] bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: false }}
          style={{ originX: 0 }}
        />
      </div>
    </section>
  );
};

const FinalCTASection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  return (
    <section id="contact" className="relative py-32 bg-background flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <CinematicReveal>
            <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl text-pearl-ivory mb-8 tracking-tight">
              Own The <br />
              <span className="text-primary">Legacy</span>
            </h2>
          </CinematicReveal>

          <CinematicReveal delay={0.2}>
            <p className="font-paragraph text-xl text-champagne-beige/80 max-w-2xl mx-auto mb-16 font-light">
              Limited plots available. Secure your piece of East Bangalore's finest address today.
            </p>
          </CinematicReveal>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mb-20">
          <CinematicReveal delay={0.3}>
            <form onSubmit={(e) => { e.preventDefault(); onOpenContactForm(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-paragraph text-sm text-champagne-beige/80 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-paragraph text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                  placeholder="Tell us about your interest in Meenakshi Pearl..."
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:bg-primary/90 font-paragraph text-base py-3 rounded-lg mt-6 transition-all"
              >
                Send Message
              </Button>

              <p className="font-paragraph text-xs text-white/30 text-center">
                We respect your privacy. Your information will never be shared.
              </p>
            </form>
          </CinematicReveal>
        </div>

        {/* CTA Buttons */}
        <CinematicReveal delay={0.4}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <Button 
                size="lg" 
                className="relative bg-primary text-black hover:bg-primary/90 font-paragraph text-lg px-12 py-8 rounded-none min-w-[240px]"
                onClick={onOpenContactForm}
              >
                <Phone className="w-5 h-5 mr-3" />
                Request Callback
              </Button>
            </div>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/5 font-paragraph text-lg px-12 py-8 rounded-none min-w-[240px]"
              onClick={onOpenContactForm}
            >
              <Mail className="w-5 h-5 mr-3" />
              Download Brochure
            </Button>
          </div>
        </CinematicReveal>

        <CinematicReveal delay={0.6} className="pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-center gap-8 text-sm text-white/30 font-paragraph uppercase tracking-widest">
            <span>Sales Office: Sarjapur Road</span>
            <span className="hidden md:inline">•</span>
            <span>Open Daily: 9:00 AM - 6:00 PM</span>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};