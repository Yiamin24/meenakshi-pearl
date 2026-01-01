import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectAmenities } from '@/entities';
import { Image } from '@/components/ui/image';

interface Card3DProps {
  amenity: ProjectAmenities;
  index: number;
}

// Nested carousel component for image rotation within each card
const NestedCarousel: React.FC<{ imageUrl?: string; amenityName?: string }> = ({ imageUrl, amenityName }) => {
  // Create a set of placeholder images for the carousel
  // In production, you might fetch these from the amenity data
  const carouselImages = useMemo(() => {
    // If we have a main image, we'll create variations
    // For now, we'll use the single image repeated with different opacity/filters
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

  // Calculate total width for seamless loop
  const itemWidth = 100; // Each item takes 100% of container
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
        {/* Original set */}
        {carouselImages.map((img, idx) => (
          <div key={`${img.id}-original`} className="flex-shrink-0 w-full h-full relative">
            {img.url && (
              <Image
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover"
              />
            )}
            {/* Subtle overlay with label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span className="text-xs text-white/70 uppercase tracking-widest">{img.label}</span>
            </div>
          </div>
        ))}

        {/* Duplicate set for seamless loop */}
        {carouselImages.map((img, idx) => (
          <div key={`${img.id}-duplicate`} className="flex-shrink-0 w-full h-full relative">
            {img.url && (
              <Image
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover"
              />
            )}
            {/* Subtle overlay with label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span className="text-xs text-white/70 uppercase tracking-widest">{img.label}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Gradient fade edges for seamless effect */}
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
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
        className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 group"
      >
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />

        {/* Nested Carousel Container */}
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
          
          {/* Carousel with smooth left-to-right animation */}
          <NestedCarousel 
            imageUrl={amenity.galleryImage} 
            amenityName={amenity.amenityName}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />

          {/* Content */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-30"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-heading text-2xl md:text-3xl text-pearl-ivory">
                  {amenity.amenityName}
                </h3>
                <span className="font-mono text-primary/70 text-lg">0{index + 1}</span>
              </div>
              <p className="font-paragraph text-sm text-champagne-beige/80 line-clamp-2">
                {amenity.description}
              </p>
            </div>
          </motion.div>

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
          className="absolute inset-0 rounded-xl pointer-events-none"
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

interface Amenities3DProps {
  amenities: ProjectAmenities[];
}

const Amenities3DSection: React.FC<Amenities3DProps> = ({ amenities }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-champagne-beige/5 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-6">
              The Collection
            </h2>
            <p className="font-paragraph text-primary uppercase tracking-widest text-sm">
              World-Class Amenities with Dynamic Showcases
            </p>
          </motion.div>

          <motion.div
            className="w-24 h-1 bg-primary mt-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 96, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          />
        </div>

        {/* 3D Cards Grid with Optimized Performance */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 auto-rows-max"
        >
          {amenities.map((amenity, index) => (
            <div 
              key={amenity._id} 
              className="h-96 md:h-[450px] lg:h-[500px] will-change-transform"
              style={{
                // Optimize rendering with GPU acceleration
                transform: 'translateZ(0)',
              }}
            >
              <Card3D amenity={amenity} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <motion.div
          className="mt-24 md:mt-32 pt-16 border-t border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <motion.div
                className="font-heading text-3xl md:text-4xl text-primary mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                {amenities.length}+
              </motion.div>
              <p className="font-paragraph text-sm text-champagne-beige/60">
                Premium Amenities
              </p>
            </div>
            <div className="text-center">
              <motion.div
                className="font-heading text-3xl md:text-4xl text-primary mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                100%
              </motion.div>
              <p className="font-paragraph text-sm text-champagne-beige/60">
                World-Class Quality
              </p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <motion.div
                className="font-heading text-3xl md:text-4xl text-primary mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                ∞
              </motion.div>
              <p className="font-paragraph text-sm text-champagne-beige/60">
                Timeless Design
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Amenities3DSection;
