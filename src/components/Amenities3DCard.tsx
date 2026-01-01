import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectAmenities } from '@/entities';
import { Image } from '@/components/ui/image';

interface Card3DProps {
  amenity: ProjectAmenities;
  index: number;
}

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

        {/* Image Container */}
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
          {amenity.galleryImage && (
            <Image
              src={amenity.galleryImage}
              alt={amenity.amenityName || 'Amenity'}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
          )}

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
  const [visibleCards, setVisibleCards] = useState<number>(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-heading text-5xl md:text-7xl text-pearl-ivory mb-6">
              The Collection
            </h2>
            <p className="font-paragraph text-primary uppercase tracking-widest text-sm">
              World-Class Amenities
            </p>
          </motion.div>

          <motion.div
            className="w-24 h-1 bg-primary mt-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 96, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </div>

        {/* 3D Cards Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {amenities.map((amenity, index) => (
            <div key={amenity._id} className="h-96 md:h-[500px]">
              <Card3D amenity={amenity} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-24 md:mt-32 pt-16 border-t border-primary/20 grid grid-cols-2 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">
              {amenities.length}+
            </div>
            <p className="font-paragraph text-sm text-champagne-beige/60">
              Premium Amenities
            </p>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">
              100%
            </div>
            <p className="font-paragraph text-sm text-champagne-beige/60">
              World-Class Quality
            </p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <div className="font-heading text-3xl md:text-4xl text-primary mb-2">
              ∞
            </div>
            <p className="font-paragraph text-sm text-champagne-beige/60">
              Timeless Design
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Amenities3DSection;
