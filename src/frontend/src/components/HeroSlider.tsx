import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  fallbackImageUrl: string;
  fallbackGradient: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Stunning Red Elegance",
    subtitle: "Fashion-forward styles for the modern woman",
    tag: "LADIES FASHION",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&fit=crop&crop=top",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.30 0.18 15) 0%, oklch(0.22 0.20 10) 50%, oklch(0.18 0.14 350) 100%)",
  },
  {
    id: 2,
    title: "Elegance Redefined",
    subtitle: "Premium quality fashion for every occasion",
    tag: "PREMIUM FASHION",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.28 0.08 40) 0%, oklch(0.22 0.12 35) 40%, oklch(0.18 0.10 55) 100%)",
  },
  {
    id: 3,
    title: "Luxury Fragrances",
    subtitle: "Explore our exclusive perfume collection",
    tag: "FRAGRANCES",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.20 0.10 280) 0%, oklch(0.25 0.12 270) 50%, oklch(0.18 0.08 290) 100%)",
  },
  {
    id: 4,
    title: "Beautiful Interiors",
    subtitle: "Transform your home with our decor collection",
    tag: "HOME DECOR",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.18 0.06 120) 0%, oklch(0.22 0.10 100) 50%, oklch(0.20 0.08 140) 100%)",
  },
  {
    id: 5,
    title: "Men's Style",
    subtitle: "Classic and modern styles for men",
    tag: "MEN'S COLLECTION",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.20 0.12 200) 0%, oklch(0.18 0.14 180) 50%, oklch(0.24 0.10 210) 100%)",
  },
  {
    id: 6,
    title: "Men's Fashion Collection",
    subtitle: "Trendy styles for every occasion",
    tag: "NEW ARRIVALS",
    imageUrl: "/assets/images/user-slide-man-fashion.jpeg",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.22 0.10 220) 0%, oklch(0.18 0.13 210) 50%, oklch(0.25 0.08 230) 100%)",
  },
  {
    id: 7,
    title: "Ladies Fashion",
    subtitle: "Elegant styles for modern women",
    tag: "LATEST COLLECTION",
    imageUrl: "/assets/images/user-slide-lady-red.jpeg",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.28 0.18 12) 0%, oklch(0.22 0.20 8) 50%, oklch(0.18 0.14 350) 100%)",
  },
  {
    id: 8,
    title: "Kids Collection",
    subtitle: "Adorable outfits for your little ones",
    tag: "BABY & KIDS",
    imageUrl: "/assets/images/user-slide-kids.jpeg",
    fallbackImageUrl:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1200&q=80",
    fallbackGradient:
      "linear-gradient(135deg, oklch(0.30 0.14 60) 0%, oklch(0.25 0.16 50) 50%, oklch(0.20 0.12 70) 100%)",
  },
];

function SlideBackground({ slide }: { slide: Slide }) {
  const [imgState, setImgState] = useState<"primary" | "fallback" | "gradient">(
    "primary",
  );

  const src =
    imgState === "primary"
      ? slide.imageUrl
      : imgState === "fallback"
        ? slide.fallbackImageUrl
        : null;

  function handleError() {
    if (imgState === "primary") setImgState("fallback");
    else setImgState("gradient");
  }

  return (
    <div className="absolute inset-0">
      {src ? (
        <img
          src={src}
          alt={slide.title}
          className="w-full h-full object-cover"
          onError={handleError}
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: slide.fallbackGradient }}
        />
      )}
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/45" />
      {/* Bottom gradient for dot readability */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }}
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </div>
  );
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full h-56 md:h-auto md:min-h-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="Featured collections slideshow"
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center"
        >
          {/* Background image with overlay */}
          <SlideBackground slide={slide} />

          {/* Content — positioned above background */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Tag badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-3 px-4 py-1.5 rounded-full text-xs font-body font-bold tracking-[0.15em] border border-white/30 bg-white/10 text-white backdrop-blur-sm"
            >
              {slide.tag}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="font-display font-bold text-2xl md:text-4xl leading-tight mb-2 text-white drop-shadow-lg"
            >
              {slide.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 font-body text-sm md:text-base max-w-xs leading-relaxed drop-shadow"
            >
              {slide.subtitle}
            </motion.p>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.38, duration: 0.5 }}
              className="mt-4 h-0.5 w-16 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next navigation buttons */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/55 text-white rounded-full p-1.5 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        data-ocid="hero-slide-prev"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/55 text-white rounded-full p-1.5 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        data-ocid="hero-slide-next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            onClick={() => goTo(i)}
            className="transition-smooth rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor:
                i === current
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.40)",
            }}
            data-ocid={`hero-slide-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
