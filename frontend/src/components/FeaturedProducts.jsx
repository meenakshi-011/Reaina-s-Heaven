import React, { useState, useEffect } from "react";
import ProductCard from "./productcard";
import { getProducts } from "../services/api";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        // Just take the first 4 for the home page
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err);
        setLoading(false);
      });
  }, []);

  if (loading && products.length === 0) return null;

  return (
    <section className="bg-[#f8f5f2] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-[#a67c52] uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3e3e3e]">
              Featured <span className="text-green-800 italic">Treasures</span>
            </h2>
          </div>
          <Link 
            to="/products" 
            className="group flex items-center gap-2 text-[#a67c52] font-bold text-[10px] md:text-xs uppercase tracking-widest hover:text-[#3e3e3e] transition-colors bg-white/50 md:bg-transparent px-4 py-2 md:p-0 rounded-full border border-[#a67c52]/20 md:border-none"
          >
            View All Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
