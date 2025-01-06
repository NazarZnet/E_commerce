import React from "react";
import ProductCard from "./ProductCart";
import { Product } from "../interfaces/product";


const Popular: React.FC<{ products: Product[] }> = ({ products }) => {
    return (
        <section className="w-full px-6 py-12 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg">
            {/* Section Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl  font-bold text-gray-800">
                        Popular <span className="text-orange-500">Product</span>
                    </h2>
                    <p className="text-gray-600">
                        Discover our best-selling product loved by customers worldwide.
                    </p>
                </div>
                <button className="h-14 bg-orange-500 text-white py-3 px-6 rounded-full text-sm lg:text-base hover:bg-orange-600 shadow-lg transition-all duration-300 transform hover:scale-105">
                    Show more
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-4 gap-12">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default Popular;
