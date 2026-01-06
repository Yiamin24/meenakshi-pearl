import React, { useRef, useState, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ProjectAmenities } from '@/entities';
import { Image } from '@/components/ui/image';

interface Card3DProps {
  amenity: ProjectAmenities;
  index: number;
}

/* =========================
   Nested Carousel
========================= */
const NestedCarousel: React.FC<{ imageUrl?: string; amenityName?: string }> = ({
  imageUrl,
  amenityName,
}) => {
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
        <span className="text-foreground/20 font-heading text-2xl italic">
          {amenityName || 'Amenity'}
        </span>
      </div>
    );
  }

  const itemWidth = 100;
  const totalWidth = carouselImages.length * itemWidth;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="flex w-full h-full"
        animate={{ x: [0, -totalWidth] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {carouselImages.map(img => (
          <div key={`${img.id}-a`} className="flex-shrink-0 w-full h-full">
            <Image src={img.url!} alt={img.label} className="w-full h-full object-cover" />
          </div>
        ))}
        {carouselImages.map(img => (
          <div key={`${img.id}-b`} className="flex-shrink-0 w-full h-full">
            <Image src={img.url!} alt={img.label} className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* =========================
   Card 3D
========================= */
const Card3D: React.FC<Card3DProps> = ({ amenity, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(y / 10);
    setRotateY(-x / 10);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setRotateX(0);
        setRotateY(0);
        setIsHovered(false);
      }}
      style={{ perspective: '1000px' }}
      className="h-full"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full h-full rounded-lg overflow-hidden border border-foreground/20 group hover:border-primary/50 transition-colors duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
          <NestedCarousel imageUrl={amenity.galleryImage} amenityName={amenity.amenityName} />
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        )}
      </motion.div>
    </motion.div>
  );
};

/* =========================
   Amenity Card
========================= */
const AmenityCard: React.FC<{ amenity: ProjectAmenities; index: number }> = ({
  amenity,
  index,
}) => {
  const itemRef = useRef(null);
  const itemInView = useInView(itemRef, { once: false, margin: '-50px' });

  return (
    <div ref={itemRef} className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={itemInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="h-64 md:h-72"
      >
        <Card3D amenity={amenity} index={index} />
      </motion.div>

      <motion.div
        className="mt-5 md:mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={itemInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 + 0.15 }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-heading text-xl md:text-2xl text-foreground">
            {amenity.amenityName}
          </h3>
          <span className="font-mono text-primary/60 text-xs uppercase tracking-widest">
            0{index + 1}
          </span>
        </div>
        <p className="font-paragraph text-sm md:text-base text-foreground/70 leading-relaxed">
          {amenity.description}
        </p>
      </motion.div>
    </div>
  );
};

/* =========================
   Section
========================= */
const Amenities3DSection: React.FC<{ amenities: ProjectAmenities[] }> = ({ amenities }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const dividerWidth = useTransform(scrollYProgress, [0.1, 0.3], [0, 96]);

  return (
    <section ref={sectionRef} id="amenities" className="py-20 md:py-28 bg-foreground/5">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-16 md:mb-24">
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground mb-4">
            The Collection
          </h2>
          <p className="font-paragraph text-primary uppercase tracking-widest text-xs md:text-sm">
            World-Class Amenities
          </p>
          <motion.div className="h-1 bg-primary mt-6" style={{ width: dividerWidth }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {amenities.map((amenity, index) => (
            <AmenityCard key={amenity._id} amenity={amenity} index={index} />
          ))}
        </div>

        {/* ===== UPDATED SIZE ONLY ===== */}
        <motion.div
          className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-primary/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-6 md:gap-12">
            <div className="text-center">
              <div className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-3 font-semibold tracking-tight">
                {amenities.length}+
              </div>
              <p className="font-paragraph text-sm md:text-base text-foreground/60 uppercase tracking-widest">
                Premium Amenities
              </p>
            </div>

            <div className="text-center">
              <div className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-3 font-semibold tracking-tight">
                100<span className="text-3xl sm:text-4xl md:text-5xl align-top">%</span>
              </div>
              <p className="font-paragraph text-sm md:text-base text-foreground/60 uppercase tracking-widest">
                World-Class Quality
              </p>
            </div>

            <div className="text-center">
              <div className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-3 font-semibold tracking-tight">
                ∞
              </div>
              <p className="font-paragraph text-sm md:text-base text-foreground/60 uppercase tracking-widest">
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
