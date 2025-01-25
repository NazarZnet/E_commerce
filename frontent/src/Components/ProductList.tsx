import React from "react";
import ProductCard from "./ProductCart";
import { Product } from "../interfaces/product";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';


const ProductList: React.FC<{ products: Product[], title: string, subtitle: string, description: string | null, onShowMore: () => void }> = ({ products, title, subtitle, description, onShowMore }) => {
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
                <button onClick={onShowMore} className="h-14 bg-orange-500 text-white py-3 px-6 rounded-full text-sm lg:text-base hover:bg-orange-600 shadow-lg transition-all duration-300 transform hover:scale-105">
                    Show more
                </button>
            </div>

            {/* Product Grid */}
            <Swiper
                spaceBetween={30}
                slidesPerView={1.2}
                loop={true}
                centeredSlides={false}
                breakpoints={{
                    640: { slidesPerView: 4 },
                    768: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4, spaceBetween: 5 },
                    1536: { slidesPerView: 4.2, spaceBetween: 5 },
                    2000: { slidesPerView: 5, spaceBetween: 5 }
                }}

            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

        </section>
    );
};

export default ProductList;
