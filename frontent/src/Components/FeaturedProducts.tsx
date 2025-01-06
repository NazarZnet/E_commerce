import React from "react";
import featuredImage from "../assets/images/featured.png";
import ProductCard from "./ProductCart";
import { Product } from "../interfaces/product";

interface FeaturedProductsProps {
    products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
    return (
        <div className="p-6 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Featured <br /> <span className="text-orange-500">Products</span>
            </h2>

            <section id="featured_products" className="flex flex-col md:flex-row gap-6">
                {/* Left Section */}
                <div className="md:w-1/5 flex flex-col justify-start items-start">
                    {/* Description */}
                    <p className="text-gray-700 mb-6 text-sm lg:text-base">
                        Discover the best selection of electric scooters, bikes, and accessories at unbeatable prices. Designed for your comfort and ease.
                    </p>

                    {/* Button */}
                    <button className="bg-orange-500 text-white py-3 px-6 rounded-full text-sm lg:text-base hover:bg-orange-600 shadow-lg transition-all duration-300 transform hover:scale-105">
                        Show more
                    </button>

                    {/* Image */}
                    <div className="relative mt-10 w-full flex justify-center">
                        <img
                            src={featuredImage}
                            alt="Featured Product"
                            className="h-56 lg:h-72 object-contain transition-all duration-300 transform hover:scale-110"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full flex gap-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FeaturedProducts;
