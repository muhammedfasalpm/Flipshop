import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL, getImageUrl } from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "null"
  );

  const getProduct = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/products/getone/${id}`
      );

      setProduct(res.data);

      if (res.data.images?.length > 0) {
        setSelectedImage(getImageUrl(res.data.images[0]));
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/products/get`
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!userInfo) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_URL}/api/cart/add`,
        {
          userId: userInfo._id,
          productId: product._id,
          quantity: 1,
        }
      );

      alert("Added to cart");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-medium">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-slate-400 font-medium">
        Product not found
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="max-w-7xl mx-auto bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl backdrop-blur-md">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Images */}
          <div>

            <img
              src={selectedImage || getImageUrl(product.images?.[0])}
              alt={product.name}
              className="w-full h-[450px] sm:h-[500px] object-cover border border-slate-700/60 rounded-2xl bg-slate-900"
            />

            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt=""
                  onClick={() => setSelectedImage(getImageUrl(image))}
                  className="w-20 h-20 border border-slate-700 rounded-xl cursor-pointer object-cover bg-slate-900 hover:border-purple-400 transition-all"
                />
              ))}

            </div>

          </div>

          {/* Details */}
          <div className="space-y-4">

            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
              {product.category || "General"}
            </span>

            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] mt-2">
              {product.name}
            </h1>

            <p className="text-blue-400 text-3xl font-bold font-['Outfit']">
              ₹{product.price?.toLocaleString()}
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              {product.description || "High-performance quality product with standard warranty."}
            </p>

            <div className="pt-4 border-t border-slate-700/60 space-y-2 text-sm text-slate-300">
              <p>
                <strong className="text-white">Brand:</strong> {product.brand || "FlipShop"}
              </p>

              <p>
                <strong className="text-white">Stock Availability:</strong> {product.stock || 10} units in stock
              </p>
            </div>

            <div className="flex gap-4 pt-6">

              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary-gradient py-3.5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-purple-600/30"
              >
                Add To Cart
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 border border-purple-500/40 text-white py-3.5 rounded-xl text-sm font-semibold hover:border-blue-400 transition-all"
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* Related Products */}
        {products.length > 0 && (
          <div className="mt-14 pt-8 border-t border-slate-700/60">

            <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

              {products
                .filter(
                  (item) => item._id !== product._id
                )
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >

                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4 flex-1 flex flex-col justify-between">

                      <div>
                        <h3 className="font-semibold text-white line-clamp-1 font-['Outfit']">
                          {item.name}
                        </h3>

                        <p className="text-blue-400 font-bold mt-1 text-sm">
                          ₹{item.price?.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        to={`/product/${item._id}`}
                        className="block text-center mt-4 bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-white py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        View Product
                      </Link>

                    </div>

                  </div>
                ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;


