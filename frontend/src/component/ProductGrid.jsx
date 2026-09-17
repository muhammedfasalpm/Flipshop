
import ProductCard from "./ProductCard";
import { PackageX } from "lucide-react";

const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#0f172a]/50 rounded-3xl border border-purple-900/30 text-center backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 animate-bounce">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white font-['Outfit']">No Products Found</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md">
          We couldn't find any products matching your selection right now. Check back soon for fresh stock!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;