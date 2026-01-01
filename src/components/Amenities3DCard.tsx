import React, { useRef, useState, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ProjectAmenities } from '@/entities';
import { Image } from '@/components/ui/image';

interface Card3DProps {
  amenity: ProjectAmenities;
  index: number;
}

// Nested carousel component for image rotation within each card
const NestedCarousel: React.FC<{ imageUrl?: string; amenityName?: string }> = ({ imageUrl, amenityName }) => {
  const carouselImages = useMemo(() => {
    return [
      { id: 1, url: imageUrl, label: 'Main View' },
      { id: 2, url: imageUrl, label: 'Detail View' },
      { id: 3, url: imageUrl, label: 'Overview' },
    ].filter(img => img.url);
  }, [imageUrl]);

  if (!imageUrl || carouselImages.length === 0) {
    return (
      <div className="w-full h-full bg-white/5 flex items-center justify-center">
        <span className="text-white/20 font-heading text-2xl italic">{amenityName || 'Amenity'}</span>
      </div>
    );
  }

  const itemWidth = 100;
  const totalWidth = carouselImages.length * itemWidth;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="flex w-full h-full"
        animate={{ x: [0, -totalWidth * 1] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {carouselImages.map((img, idx) => (
          <div key={`${img.id}-original`} className="flex-shrink-0 w-full h-full relative">
            {img.url && (
              <Image
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}

        {carouselImages.map((img, idx) => (
          <div key={`${img.id}-duplicate`} className="flex-shrink-0 w-full h-full relative">
            {img.url && (
              <Image
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </motion.div>

      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};

const Card3D: React.FC<Card3DProps> = ({ amenity, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotationX = (mouseY - centerY) / 10;
    const rotationY = (centerX - mouseX) / 10;

    setRotateX(rotationX);
    setRotateY(rotationY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="h-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 group hover:border-primary/50 transition-colors duration-500"
      >
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />

        {/* Image Container with Carousel */}
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
          
          <NestedCarousel 
            imageUrl={amenity.galleryImage} 
            amenityName={amenity.amenityName}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />

          {/* Hover Glow Effect */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none z-40"
            />
          )}
        </div>

        {/* Border Glow on Hover */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: isHovered
              ? 'inset 0 0 20px rgba(184, 134, 11, 0.3), 0 0 20px rgba(184, 134, 11, 0.2)'
              : 'inset 0 0 0px rgba(184, 134, 11, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

// Separate component for each amenity card to avoid hooks in loops
const AmenityCard: React.FC<{ amenity: ProjectAmenities; index: number }> = ({ amenity, index }) => {
  const itemRef = useRef(null);
  const itemInView = useInView(itemRef, { once: false, margin: '-50px' });

  return (
    <div 
      key={amenity._id}
      ref={itemRef}
      className="flex flex-col"
    >
      {/* Smaller Card - 280px height */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={itemInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="h-64 md:h-72 will-change-transform"
        style={{
          transform: 'translateZ(0)',
        }}
      >
        <Card3D amenity={amenity} index={index} />
      </motion.div>
      
      {/* Text Content - Always Visible, Animates with Card */}
      <motion.div
        className="mt-5 md:mt-6 flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.08 + 0.15,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-heading text-lg md:text-xl text-pearl-ivory hover:text-primary transition-colors duration-300 flex-1">
            {amenity.amenityName}
          </h3>
          <span className="font-mono text-primary/60 text-xs uppercase tracking-widest whitespace-nowrap">
            0{index + 1}
          </span>
        </div>
        <p className="font-paragraph text-xs md:text-sm text-champagne-beige/70 leading-relaxed line-clamp-2">
          {amenity.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="font-paragraph text-xs text-primary/50 uppercase tracking-wider">
            Premium Amenity
          </span>
        </div>
      </motion.div>
    </div>
  );
};

interface Amenities3DProps {
  amenities: ProjectAmenities[];
}

const Amenities3DSection: React.FC<Amenities3DProps> = ({ amenities }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  
  // Create scroll-based animations that reverse on scroll-up
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const dividerWidth = useTransform(scrollYProgress, [0.1, 0.3], [0, 96]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-champagne-beige/5 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Modern Section Header with Scroll-Based Animation */}
        <motion.div 
          className="mb-16 md:mb-24"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
            <div>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-pearl-ivory mb-4">
                The Collection
              </h2>
              <p className="font-paragraph text-primary uppercase tracking-widest text-xs md:text-sm">
                World-Class Amenities
              </p>
            </div>
            <motion.div
              className="h-1 bg-gradient-to-r from-primary to-primary/30"
              style={{ width: dividerWidth }}
            />
          </div>
        </motion.div>

        {/* Modern Grid Layout - Smaller Cards */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-max"
        >
          {amenities.map((amenity, index) => (
            <AmenityCard key={amenity._id} amenity={amenity} index={index} />
          ))}
        </div>

        {/* Modern Stats Section with Scroll Animation */}
        <motion.div
          className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-primary/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, margin: '-100px' }}
        >
          <div className="grid grid-cols-3 gap-6 md:gap-12">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: false }}
            >
              <div className="font-heading text-2xl md:text-3xl text-primary mb-2">
                {amenities.length}+
              </div>
              <p className="font-paragraph text-xs md:text-sm text-champagne-beige/60">
                Premium Amenities
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false }}
            >
              <div className="font-heading text-2xl md:text-3xl text-primary mb-2">
                100%
              </div>
              <p className="font-paragraph text-xs md:text-sm text-champagne-beige/60">
                World-Class Quality
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: false }}
            >
              <div className="font-heading text-2xl md:text-3xl text-primary mb-2">
                ∞
              </div>
              <p className="font-paragraph text-xs md:text-sm text-champagne-beige/60">
                Timeless Design
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Amenities3DSection;
