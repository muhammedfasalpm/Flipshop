import React, { useEffect, useState } from "react";

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1400&auto=format&fit=crop",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&auto=format&fit=crop",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1400&auto=format&fit=crop",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&auto=format&fit=crop",
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white shadow">

      {/* Banner Image */}
      <img
        src={slides[current].image}
        alt={`Banner ${current + 1}`}
        className="w-full h-[400px] object-cover"
      />

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded shadow-lg"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded shadow-lg"
      >
        ❯
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              current === index
                ? "bg-white"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;