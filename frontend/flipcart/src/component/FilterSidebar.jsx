import { SlidersHorizontal, RotateCcw } from "lucide-react";

const FilterSidebar = ({
  category,
  setCategory,
  sort,
  setSort,
}) => {
  const handleReset = () => {
    setCategory("All");
    setSort("");
  };

  return (
    <div className="bg-[#0f172a]/90 p-5 rounded-3xl border border-purple-900/40 shadow-xl backdrop-blur-md space-y-5">

      <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
        <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-purple-400" />
          <span>Filters</span>
        </h2>

        {(category !== "All" || sort !== "") && (
          <button
            onClick={handleReset}
            className="text-xs text-purple-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Mobiles">Mobiles & Tablets</option>
          <option value="Fashion">Fashion & Apparel</option>
          <option value="Electronics">Electronics & IT</option>
          <option value="Audio">Audio & Headphones</option>
          <option value="Wearables">Smart Wearables</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="">Default Featured</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

    </div>
  );
};

export default FilterSidebar;