import React, { useRef, useEffect } from 'react'
import { ProjectAmenities } from '@/entities'
import { Image } from '@/components/ui/image'

/* =========================
   Single Amenity Card
========================= */
const AmenityCard: React.FC<{ amenity: ProjectAmenities }> = ({ amenity }) => {
  return (
    <div className="min-w-[280px] md:min-w-[340px] lg:min-w-[380px] flex-shrink-0">
      <div className="rounded-xl overflow-hidden border border-foreground/20 bg-black/20">
        <div className="h-56 md:h-64">
          {amenity.galleryImage ? (
            <Image
              src={amenity.galleryImage}
              alt={amenity.amenityName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="font-heading text-2xl text-foreground/30">
                {amenity.amenityName}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-heading text-xl text-foreground mb-2">
            {amenity.amenityName}
          </h3>
          <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
            {amenity.description}
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Horizontal Carousel Section
========================= */
const Amenities3Dcard: React.FC<{ amenities: ProjectAmenities[] }> = ({
  amenities,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)

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
    <section className="py-20 md:py-28 bg-foreground/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 mb-12">
        <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground mb-4">
          The Collection
        </h2>
        <p className="font-paragraph text-primary uppercase tracking-widest text-sm">
          World-Class Amenities
        </p>
      </div>

      <div className="relative overflow-x-auto">
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 px-4 md:px-8 cursor-grab active:cursor-grabbing"
        >
          {amenities.map(amenity => (
            <AmenityCard key={amenity._id} amenity={amenity} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Amenities3Dcard
