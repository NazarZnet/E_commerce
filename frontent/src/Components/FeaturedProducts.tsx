import React from "react";
import featuredImage from "../assets/images/featured.png";

interface Gallery {
    id: number;
    image: string;
}

interface Product {
    id: number;
    name: string;
    gallery: Gallery[];
    price: number;
    discounted_price: number;
    discount_percentage: number
    description: string;
}
interface FeaturedProductsProps {
    products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
    const renderDiscountBadge = (product: Product) => {
        if (product.discount_percentage && product.discount_percentage > 0) {
            return (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded-full z-10">
                    -{product.discount_percentage}%
                </div>
            );
        }
        return null;
    };
    return (
        <div className="p-6 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Featured <br /> <span className="text-orange-500">Products</span>
            </h2>

            <section id="featured_products" className="flex flex-col md:flex-row gap-6 ">
                {/* Left Section */}
                <div className="md:w-1/5 flex flex-col justify-start items-start ">
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
                        <div
                            key={product.id}
                            className="relative bg-white shadow-md rounded-lg overflow-hidden group hover:shadow-lg transition h-[90%]"
                        >
                            {/* Discount Badge */}
                            {renderDiscountBadge(product)}
                            {/* Product Image */}
                            <div className="relative h-[70%]">
                                <img
                                    src={product.gallery[0]?.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Description Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0 overflow-hidden z-20">
                                    <p className="p-4 text-sm">{product.description}</p>
                                </div>
                            </div>
                            {/* Product Details */}
                            <div className="h-[30%] p-4 flex flex-col justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    {product.discounted_price !== product.price ? (
                                        <>
                                            <span className="text-gray-400 line-through">
                                                ${product.price}
                                            </span>
                                            <span className="text-orange-500 font-bold">
                                                ${product.discounted_price}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">${product.price}</span>
                                    )}
                                </div>
                                <div className="flex gap-1 mt-3">
                                    <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition w-full">
                                        Add to Cart
                                    </button>
                                    <button className="bg-transparent border border-orange-500 text-orange-500 py-2 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition w-full">
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </div>
    );

};

export default FeaturedProducts;
