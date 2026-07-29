import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Laptop, 
  Smartphone, 
  Shirt, 
  Headphones, 
  Watch, 
  Sparkles, 
  Tag, 
  Grid 
} from "lucide-react";

const categoryIcons = {
  electronics: Laptop,
  mobile: Smartphone,
  mobiles: Smartphone,
  fashion: Shirt,
  clothing: Shirt,
  audio: Headphones,
  watches: Watch,
  wearables: Watch,
};

const CategorySection = ({ categories = [] }) => {
  const navigate = useNavigate();

  // Fallback standard categories if empty
  const list = categories.length > 0 
    ? categories 
    : ["Electronics", "Fashion", "Mobiles", "Audio", "Wearables", "Home"];

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Grid className="w-5 h-5 text-purple-400" />
            <span>Shop By Category</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Explore our top curated collections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {list.map((cat) => {
          const key = cat.toLowerCase();
          const IconComponent = categoryIcons[key] || Tag;
          return (
            <button
              key={cat}
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(cat)}`)
              }
              className="group relative p-4 rounded-2xl bg-[#0f172a]/80 border border-purple-900/30 hover:border-blue-500/60 hover:bg-slate-900 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 shadow-md hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 group-hover:border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300 shadow-inner">
                <IconComponent className="w-6 h-6" />
              </div>

              <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors relative z-10">
                {cat}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;