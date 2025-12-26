"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useCart } from "../contexts/CartContext";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  stock_quantity: number;
  thc_content?: number;
  cbd_content?: number;
  strain_type?: string;
  image_url?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>

        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-4xl">🌿</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span className="text-lg font-bold text-primary-600">
                  ${product.price}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {product.category_name}
                </span>
                {product.strain_type && (
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
                    {product.strain_type}
                  </span>
                )}
              </div>

              {(product.thc_content || product.cbd_content) && (
                <div className="flex justify-between text-xs text-gray-600 mb-3">
                  {product.thc_content && (
                    <span>THC: {product.thc_content}%</span>
                  )}
                  {product.cbd_content && (
                    <span>CBD: {product.cbd_content}%</span>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Stock: {product.stock_quantity}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock_quantity === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
