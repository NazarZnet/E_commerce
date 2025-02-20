import React from "react";
import featuredImage from "../assets/images/featured.png";
import ProductCard from "./ProductCart";
import { Product } from "../interfaces/product";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";

import "swiper/swiper-bundle.css";

interface FeaturedProductsProps {
    products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const showAllProducts = () => {
        navigate("/products");
        window.scrollTo(0, 0);

    };

    return (
        <div className="p-6 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg">


            <section id="featured_products" className="flex flex-col xl:flex-row gap-6">
                {/* Left Section */}
                <div className="xl:w-1/5 flex xl:flex-col  justify-start items-center">
                    {/* Description */}
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {t("featured")} <br /> <span className="text-orange-500"> {t("products")}</span>
                        </h2>

                        <p className="text-gray-700 mb-6 text-sm lg:text-base">
                            {t("featured_products_text")}
                        </p>

                        {/* Button */}
                        <button
                            onClick={showAllProducts}
                            className="bg-orange-500 text-white py-3 px-6 rounded-full text-sm lg:text-base hover:bg-orange-600 shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            {t("show_more")}
                        </button>
                    </div>

                    {/* Image */}
                    <div className="hidden sm:flex relative mt-10 w-full justify-center">
                        <img
                            src={featuredImage}
                            alt="Featured Product"
                            className="h-56 lg:h-72 object-contain transition-all duration-300 transform hover:scale-110"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full xl:mt-28">


                    <Swiper
                        spaceBetween={30}
                        slidesPerView={1.2}
                        loop={true}
                        centeredSlides={false}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 2.2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4, spaceBetween: 5 },
                            1536: { slidesPerView: 4, spaceBetween: 5 },
                            2000: { slidesPerView: 5, spaceBetween: 5 }
                        }}

                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            </section>
        </div>
    );
};

export default FeaturedProducts;