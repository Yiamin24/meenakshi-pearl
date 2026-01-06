import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ProjectAmenities } from '@/entities'
import { Image } from '@/components/ui/image'
import { ArrowRight } from 'lucide-react'

/* =========================
   Single Amenity Card
========================= */
const AmenityCard: React.FC<{ amenity: ProjectAmenities; index: number }> = ({ amenity, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="min-w-[280px] md:min-w-[340px] lg:min-w-[400px] flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image Container */}
        <div className="relative h-72 md:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-pale-sage/30 to-pale-sage/10">
          {amenity.galleryImage ? (
            <motion.div
              className="w-full h-full"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={amenity.galleryImage}
                alt={amenity.amenityName}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-beige to-pale-sage">
              <span className="font-heading text-3xl md:text-4xl text-soft-charcoal/40 text-center px-4">
                {amenity.amenityName}
              </span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-old-lace via-old-lace/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Container */}
        <div className="relative p-6 md:p-8 bg-old-lace border-l-4 border-primary/30 group-hover:border-primary transition-all duration-500">
          {/* Category Badge */}
          {amenity.category && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="inline-block mb-3 md:mb-4"
            >
              <span className="font-paragraph text-xs md:text-sm uppercase tracking-widest text-primary font-semibold">
                {amenity.category}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h3
            className="font-heading text-2xl md:text-3xl text-soft-charcoal mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2"
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {amenity.amenityName}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="font-paragraph text-sm md:text-base text-muted-gray leading-relaxed mb-4 md:mb-6 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            {amenity.description}
          </motion.p>

          {/* CTA Link */}
          <motion.div
            className="flex items-center gap-2 text-primary font-semibold text-sm md:text-base group/link cursor-pointer"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="group-hover/link:underline">Explore</span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
          </motion.div>
        </div>

        {/* Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  )
}

/* =========================
   Horizontal Carousel Section
========================= */
const Amenities3Dcard: React.FC<{ amenities: ProjectAmenities[] }> = ({
  amenities,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })

  useEffect(() => {
    if (!trackRef.current) return

    const track = trackRef.current

    const onWheel = (e: WheelEvent) => {
      // Horizontal scroll on wheel
      track.scrollLeft += e.deltaY
    }

    track.addEventListener('wheel', onWheel)

    return () => {
      track.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 lg:py-40 bg-gradient-to-b from-warm-beige via-old-lace to-warm-beige relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="container mx-auto px-4 md:px-8 mb-16 md:mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-block mb-4 md:mb-6">
            <span className="font-paragraph text-xs md:text-sm uppercase tracking-widest text-primary font-semibold">
              Premium Collection
            </span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-soft-charcoal mb-6 md:mb-8 leading-tight">
            The Collection
          </h2>
          <p className="font-paragraph text-base md:text-lg text-muted-gray max-w-2xl leading-relaxed">
            Discover world-class amenities designed to elevate your lifestyle. Each facility is meticulously crafted to provide the ultimate living experience.
          </p>
        </motion.div>

        {/* Accent Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 120, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-primary to-primary/40 mt-8 md:mt-12"
        />
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-warm-beige via-warm-beige/50 to-transparent z-20 pointer-events-none" />
        
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-warm-beige via-warm-beige/50 to-transparent z-20 pointer-events-none" />

        {/* Scroll Track */}
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 px-4 md:px-8 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing pb-4"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {amenities.map((amenity, index) => (
            <AmenityCard key={amenity._id} amenity={amenity} index={index} />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex items-center justify-center gap-2 mt-12 md:mt-16 text-muted-gray text-xs md:text-sm uppercase tracking-widest relative z-10"
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          →
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Amenities3Dcard
