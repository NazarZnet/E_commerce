import React from "react";
import ProductCard from "./ProductCart";
import { Product } from "../interfaces/product";
import { useNavigate } from "react-router-dom";


const ProductList: React.FC<{ products: Product[], title: string, subtitle: string, description: string | null }> = ({ products, title, subtitle, description }) => {
    const navigate = useNavigate();
    const showAllProducts = () => {
        navigate("/products");
        window.scrollTo(0, 0);
    }

    return (
        <section >
            {/* Section Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl  font-bold text-gray-800">
                        {title} <span className="text-orange-500">{subtitle}</span>
                    </h2>
                    {description && (
                        <p className="text-gray-600">
                            {description}
                        </p>
                    )}


                </div>
                <button onClick={showAllProducts} className="h-14 bg-orange-500 text-white py-3 px-6 rounded-full text-sm lg:text-base hover:bg-orange-600 shadow-lg transition-all duration-300 transform hover:scale-105">
                    Show more
                </button>
            </div>

            {/* Product Grid */}
            <div
                className={"flex justify-evenly items-center"}
            >
                {products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

        </section>
    );
};

export default ProductList;
