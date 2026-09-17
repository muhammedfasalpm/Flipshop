import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap, ArrowRight, ShieldCheck, Truck } from "lucide-react";

const HeroBanner = () => {
  const slides = [
    {
      id: 1,
      tag: "🔥 EXCLUSIVE TECH SALE",
      title: "Upgrade Your Digital World",
      subtitle: "Discover next-gen devices, smart wearables & accessories with up to 40% OFF.",
      image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1600&auto=format&fit=crop",
      btnText: "Shop Electronics",
      link: "/products?category=electronics"
    },
    {
      id: 2,
      tag: "⚡ NEW ARRIVALS 2026",
      title: "Premium Style & Accessories",
      subtitle: "Elevate your daily look with precision crafted apparel and modern aesthetics.",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop",
      btnText: "Explore Fashion",
      link: "/products"
    },
    {
      id: 3,
      tag: "✨ TRENDING NOW",
      title: "Audio & Smart Appliances",
      subtitle: "Immersive noise-cancelling soundscapes & seamless home smart devices.",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1600&auto=format&fit=crop",
      btnText: "View Audio",
      link: "/products"
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-purple-900/30 bg-[#0f172a] shadow-2xl my-6">
      
      {/* Background Image Carousel with Overlay */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-10000"
            />
            
            {/* Dark & Gradient Overlay for High Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold tracking-wider uppercase mb-4 w-fit backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                {slide.tag}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight mb-4 drop-shadow-md">
                {slide.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl font-normal leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={slide.link}
                  className="btn-primary-gradient px-6 py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base flex items-center gap-2.5 group shadow-lg shadow-purple-600/30 hover:shadow-blue-500/40"
                >
                  <span>{slide.btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Truck className="w-4 h-4 text-emerald-400" /> Free Delivery
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-blue-400" /> 100% Genuine
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/70 border border-purple-500/30 text-white hover:bg-purple-600/80 transition-all duration-200 backdrop-blur-md shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/70 border border-purple-500/30 text-white hover:bg-purple-600/80 transition-all duration-200 backdrop-blur-md shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-purple-500/50"
                : "w-2.5 bg-slate-600 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroBanner;