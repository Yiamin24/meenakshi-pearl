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
import { MapPin, Phone, Mail, ArrowRight, Check, Lock, TrendingUp } from 'lucide-react';
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
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-old-lace text-soft-charcoal min-h-screen overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Header />

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
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-12 sm:py-16 md:py-0 pt-0 bg-old-lace">
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <Image
          src="https://static.wixstatic.com/media/cef78c_9763d12ab5be44aca799a7f822f51380~mv2.png"
          alt="Meenakshi Pearl Aerial View"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-old-lace/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-soft-charcoal/40 via-soft-charcoal/25 to-soft-charcoal/10" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center w-full bg-gradient-to-b from-soft-charcoal/5 to-transparent rounded-2xl py-12 sm:py-16 md:py-20 shadow-lg">
        <CinematicReveal delay={0.1}>
          <span className="inline-block py-2 px-4 border border-primary rounded-lg bg-white/50 text-primary text-xs sm:text-xs md:text-sm tracking-[0.15em] uppercase mb-4 sm:mb-6">
            Plots starting from 38 lac
          </span>
        </CinematicReveal>

        <CinematicReveal delay={0.3}>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-warm-espresso mb-6 sm:mb-8 font-light leading-tight">
            Meenakshi <br className="hidden sm:block" />
            <span className="text-primary">Pearl</span>
          </h1>
        </CinematicReveal>

        <CinematicReveal delay={0.6}>
          <p className="font-paragraph text-base sm:text-lg md:text-xl text-warm-espresso max-w-3xl mx-auto mb-8 sm:mb-12 font-light leading-relaxed">
            Your gateway to luxury living in the heart of East Bangalore. <br className="hidden md:block" />
            A sanctuary of 212 premium plots across 14 acres. <br className="hidden md:block" />
            <span className="text-primary font-semibold">Grade-A Plotted Development</span>
          </p>
        </CinematicReveal>

        <CinematicReveal delay={0.8} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <Button 
            size="lg" 
            className="bg-primary text-white hover:bg-primary/90 font-paragraph text-base px-8 py-6 rounded-lg w-full sm:w-auto tracking-wide transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md"
            onClick={onOpenContactForm}
          >
            Schedule Visit
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-pale-sage font-paragraph text-base px-8 py-6 rounded-lg w-full sm:w-auto tracking-wide transition-all duration-500"
            onClick={() => document.getElementById('plots')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Masterplan
          </Button>
        </CinematicReveal>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60">Scroll to Explore</span>
        <motion.div 
          animate={{ height: [20, 40, 20] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] bg-primary/40"
        />
      </motion.div>
    </section>
  );
};

const ProjectOverviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  return (
    <section id="about" ref={ref} className="py-20 sm:py-28 md:py-36 bg-warm-beige relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-primary/15">
          {[
            { value: 14, label: "Acres of Land", suffix: "" },
            { value: 212, label: "Premium Plots", suffix: "" },
            { value: 100, label: "Vastu Compliant", suffix: "%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="font-heading text-6xl sm:text-7xl md:text-8xl text-primary/15 font-bold relative"
              >
                <span className="absolute inset-0 text-primary opacity-40">{stat.value}</span>
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/50">
                  {stat.value}{stat.suffix}
                </span>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                className="font-paragraph text-lg md:text-xl text-soft-charcoal mt-4 uppercase tracking-widest"
              >
                {stat.label}
              </motion.p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 sm:mt-28 md:mt-32 text-center">
          <CinematicReveal>
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl text-soft-charcoal max-w-4xl mx-auto leading-relaxed px-4">
              "A meticulously planned ecosystem where <span className="text-primary">luxury meets legacy</span>. Every square foot is designed to appreciate in value and quality of life."
            </p>
          </CinematicReveal>
        </div>
      </div>
    </section>
  );
};

const LocationSection = ({ onOpenContactForm }: { onOpenContactForm: () => void }) => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 bg-old-lace overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center">
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
                  <MapPin className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 text-primary relative z-10 drop-shadow-lg" fill="currentColor" />
                </div>
              </div>
            </CinematicReveal>
          </div>

          <div className="order-1 lg:order-2">
            <CinematicReveal>
              <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-soft-charcoal mb-8">
                Strategically <br />
                <span className="text-primary italic">Positioned</span>
              </h2>
            </CinematicReveal>
            
            <CinematicReveal delay={0.2}>
              <p className="font-paragraph text-base md:text-lg text-muted-gray mb-12 leading-relaxed border-l-4 border-primary/30 pl-6">
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
                  <div className="flex items-center justify-between border-b border-primary/10 pb-4 group hover:border-primary/30 transition-colors cursor-pointer" onClick={onOpenContactForm}>
                    <span className="font-heading text-xl md:text-2xl text-soft-charcoal group-hover:translate-x-2 transition-transform duration-500">{item.label}</span>
                    <span className="font-paragraph text-primary font-semibold text-base md:text-lg">{item.dist}</span>
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

const InfrastructureSection = ({ infrastructure }: { infrastructure: InfrastructureDetails[] }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const itemWidth = 384;
  const gap = 32;
  const totalWidth = infrastructure.length * (itemWidth + gap);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-warm-beige relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8">
        <div className="mb-24 md:mb-32">
          <CinematicReveal>
            <motion.h2 
              className="font-heading text-5xl md:text-7xl text-soft-charcoal mb-8 leading-tight"
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
              className="font-paragraph text-base md:text-lg text-muted-gray max-w-3xl"
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

        <div className="relative overflow-hidden mb-12">
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
              {infrastructure.map((item) => (
                <motion.div
                  key={item._id}
                  className="flex-shrink-0 w-80 md:w-96 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 md:h-72 rounded-xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-pale-sage/30 to-pale-sage/10 shadow-sm hover:shadow-md">
                    {item.featureIcon && (
                      <Image
                        src={item.featureIcon}
                        alt={item.featureName || "Feature"}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-old-lace via-old-lace/80 to-transparent">
                      <h4 className="font-heading text-xl md:text-2xl text-soft-charcoal group-hover:text-primary transition-colors duration-300">
                        {item.featureName}
                      </h4>
                      <p className="font-paragraph text-sm text-muted-gray mt-2 line-clamp-2">
                        {item.featureDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {infrastructure.map((item) => (
                <motion.div
                  key={`${item._id}-duplicate`}
                  className="flex-shrink-0 w-80 md:w-96 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 md:h-72 rounded-xl overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-pale-sage/30 to-pale-sage/10 shadow-sm hover:shadow-md">
                    {item.featureIcon && (
                      <Image
                        src={item.featureIcon}
                        alt={item.featureName || "Feature"}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-old-lace via-old-lace/80 to-transparent">
                      <h4 className="font-heading text-xl md:text-2xl text-soft-charcoal group-hover:text-primary transition-colors duration-300">
                        {item.featureName}
                      </h4>
                      <p className="font-paragraph text-sm text-muted-gray mt-2 line-clamp-2">
                        {item.featureDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="border-t border-primary/15 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="font-heading text-4xl md:text-5xl text-primary mb-3">{infrastructure.length}+</div>
            <p className="font-paragraph text-sm text-muted-gray">Premium Features</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-4xl md:text-5xl text-primary mb-3">100%</div>
            <p className="font-paragraph text-sm text-muted-gray">Global Standards</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-4xl md:text-5xl text-primary mb-3">24/7</div>
            <p className="font-paragraph text-sm text-muted-gray">Maintenance</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-4xl md:text-5xl text-primary mb-3">∞</div>
            <p className="font-paragraph text-sm text-muted-gray">Durability</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const GatedLivingSection = ({ gatedBenefits }: { gatedBenefits: GatedLivingBenefits[] }) => {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 bg-old-lace overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image 
          src="https://static.wixstatic.com/media/cef78c_f9065b5bb9c444d8956454710255821f~mv2.png?originWidth=1920&originHeight=1024"
          alt="Background Pattern"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-old-lace via-transparent to-old-lace" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-20 sm:mb-28 md:mb-32">
          <CinematicReveal>
            <div className="inline-flex items-center justify-center w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-full border border-primary/30 bg-pale-sage/40 mb-8">
              <Lock className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-primary" />
            </div>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal mb-6">Secure & Serene</h2>
          </CinematicReveal>
          <CinematicReveal delay={0.3}>
            <p className="font-paragraph text-lg md:text-xl text-muted-gray max-w-2xl mx-auto px-4">
              A sanctuary where privacy meets community. Experience the peace of mind that comes with premium gated living.
            </p>
          </CinematicReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-14 md:gap-16">
          {gatedBenefits.map((benefit, index) => (
            <CinematicReveal key={benefit._id} delay={index * 0.2}>
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-full sm:w-1/3 overflow-hidden rounded-xl aspect-[4/5] flex-shrink-0 shadow-sm">
                  {benefit.benefitVisual && (
                    <Image
                      src={benefit.benefitVisual}
                      alt={benefit.benefitTitle || "Benefit"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="w-full sm:w-2/3 pt-0 sm:pt-4">
                  <h3 className="font-heading text-2xl sm:text-3xl text-soft-charcoal mb-4">
                    {benefit.benefitTitle}
                  </h3>
                  <p className="font-paragraph text-base text-muted-gray leading-relaxed">
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

const PlotConfigurationsSection = ({ plotConfigs }: { plotConfigs: PlotConfigurations[] }) => {
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
    <section id="plots" className="py-20 sm:py-28 md:py-36 bg-warm-beige relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <SectionDivider />
        
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <CinematicReveal>
            <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-soft-charcoal mb-6">
              Plot <span className="text-primary">Configurations</span>
            </h2>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <p className="font-paragraph text-base md:text-lg text-muted-gray max-w-2xl mx-auto px-4">
              Choose from our thoughtfully designed plot options
            </p>
          </CinematicReveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 md:mb-24">
          {configCards.map((card, index) => (
            <CinematicReveal key={index} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-full flex flex-col overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-60 sm:h-72 md:h-80 overflow-hidden bg-pale-sage/20">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 bg-old-lace border border-primary/10">
                  <div>
                    <p className="font-paragraph text-primary text-xs uppercase tracking-widest mb-3">
                      {card.subtitle}
                    </p>
                    <h3 className="font-heading text-3xl sm:text-4xl text-soft-charcoal mb-3 group-hover:text-primary transition-colors duration-500">
                      {card.title}
                    </h3>
                    <p className="font-paragraph text-muted-gray text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-paragraph text-primary text-xs uppercase tracking-wider">Available</span>
                  </div>
                </div>
              </motion.div>
            </CinematicReveal>
          ))}
        </div>

        <CinematicReveal delay={0.5}>
          <div className="grid grid-cols-3 gap-6 sm:gap-10 md:gap-16 text-center py-12 sm:py-16 border-y border-primary/15">
            {[
              { number: "212", label: "Total Plots" },
              { number: "14", label: "Acres" },
              { number: "100%", label: "Vastu Compliant" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-2">{stat.number}</p>
                <p className="font-paragraph text-muted-gray text-xs uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};

const LegalSection = ({ legalApprovals }: { legalApprovals: LegalApprovals[] }) => {
  return (
    <section className="py-20 sm:py-28 md:py-36 bg-old-lace relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-primary/5 rounded-full opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <CinematicReveal>
              <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl text-soft-charcoal mb-6">
                Uncompromising <br />
                <span className="text-primary">Transparency</span>
              </h2>
            </CinematicReveal>
            <CinematicReveal delay={0.2}>
              <p className="font-paragraph text-base md:text-lg text-muted-gray">
                Your investment is secured by comprehensive legal approvals and clear titles. We believe trust is the ultimate luxury.
              </p>
            </CinematicReveal>
          </div>
          <CinematicReveal delay={0.3}>
            <div className="flex items-center gap-2 text-primary border border-primary/30 px-6 py-3 rounded-lg bg-pale-sage/30 whitespace-nowrap">
              <Check className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm font-medium">RERA Approved</span>
            </div>
          </CinematicReveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalApprovals.map((approval, index) => (
            <CinematicReveal key={approval._id} delay={index * 0.1}>
              <div className="group relative p-8 border border-primary/15 bg-warm-beige/50 hover:bg-warm-beige transition-all duration-500 h-full flex flex-col rounded-xl shadow-sm hover:shadow-md">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-pale-sage/40 rounded-lg text-primary group-hover:scale-110 transition-transform duration-500">
                    <Check className="w-6 h-6" />
                  </div>
                  {approval.approvalDate && (
                    <span className="text-xs text-muted-gray font-mono">
                      {new Date(approval.approvalDate).getFullYear()}
                    </span>
                  )}
                </div>
                
                <h3 className="font-heading text-2xl sm:text-3xl text-soft-charcoal mb-3 group-hover:text-primary transition-colors">
                  {approval.approvalName}
                </h3>
                <p className="font-paragraph text-sm text-muted-gray leading-relaxed mb-4 flex-grow">
                  {approval.description}
                </p>
                
                {approval.issuingAuthority && (
                  <div className="pt-4 border-t border-primary/10 mt-auto">
                    <p className="text-xs text-primary/70 uppercase tracking-wider">
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

const InvestmentSection = ({ investmentHighlights }: { investmentHighlights: InvestmentHighlights[] }) => {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 bg-warm-beige relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 md:mb-24 border-b border-primary/15 pb-8 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CinematicReveal>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-soft-charcoal">
              The Investment <br />
              <span className="text-primary">Advantage</span>
            </h2>
          </CinematicReveal>
          <CinematicReveal delay={0.2}>
            <div className="flex items-center gap-3 text-muted-gray mt-4 md:mt-0 whitespace-nowrap">
              <TrendingUp className="w-6 h-6" />
              <span className="uppercase tracking-widest text-sm">High Appreciation Potential</span>
            </div>
          </CinematicReveal>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 md:gap-16">
          {investmentHighlights.map((highlight, index) => (
            <CinematicReveal key={highlight._id} delay={index * 0.15}>
              <div className="relative pl-8 border-l-2 border-primary/30 hover:border-primary transition-colors duration-500 group">
                <h3 className="font-heading text-2xl sm:text-3xl text-soft-charcoal mb-4 group-hover:text-primary transition-colors duration-300">
                  {highlight.highlightTitle}
                </h3>
                
                {highlight.highlightQuote && (
                  <blockquote className="font-heading text-lg sm:text-xl text-soft-charcoal/80 italic mb-4 leading-relaxed">
                    "{highlight.highlightQuote}"
                  </blockquote>
                )}

                {highlight.additionalContext && (
                  <p className="font-paragraph text-sm text-muted-gray group-hover:text-soft-charcoal/70 transition-colors duration-300">
                    {highlight.additionalContext}
                  </p>
                )}

                <motion.div 
                  className="absolute -left-[5px] top-0 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: false }}
                />
              </div>
            </CinematicReveal>
          ))}
        </div>

        <motion.div
          className="mt-16 sm:mt-20 md:mt-24 h-[1px] bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"
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
    <section id="contact" className="relative py-20 sm:py-28 md:py-36 bg-old-lace flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] md:w-[800px] h-[600px] sm:h-[700px] md:h-[800px] bg-primary/5 rounded-full opacity-15 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full">
        <div className="text-center mb-16">
          <CinematicReveal>
            <h2 className="font-heading text-5xl sm:text-6xl md:text-8xl text-soft-charcoal mb-8 tracking-tight">
              Own The <br />
              <span className="text-primary">Legacy</span>
            </h2>
          </CinematicReveal>

          <CinematicReveal delay={0.2}>
            <p className="font-paragraph text-lg md:text-xl text-muted-gray max-w-2xl mx-auto mb-16 font-light px-4">
              Limited plots available. Secure your piece of East Bangalore's finest address today.
            </p>
          </CinematicReveal>
        </div>

        <CinematicReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-primary/90 font-paragraph text-base px-10 py-6 rounded-lg w-full sm:w-auto shadow-sm hover:shadow-md transition-all"
              onClick={onOpenContactForm}
            >
              <Phone className="w-5 h-5 mr-2" />
              Request Callback
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary/30 text-soft-charcoal hover:bg-pale-sage font-paragraph text-base px-10 py-6 rounded-lg w-full sm:w-auto transition-all"
              onClick={onOpenContactForm}
            >
              <Mail className="w-5 h-5 mr-2" />
              Download Brochure
            </Button>
          </div>
        </CinematicReveal>

        <CinematicReveal delay={0.6} className="pt-12 md:pt-16 border-t border-primary/10">
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-gray font-paragraph uppercase tracking-widest text-center">
            <span>Sales Office: Sarjapur Road</span>
            <span className="hidden sm:inline">•</span>
            <span>Open Daily: 9:00 AM - 6:00 PM</span>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
};
