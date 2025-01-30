import React from 'react';
import { Category } from '../interfaces/category';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters } from '../redux/slices/filterSlice';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { useTranslation } from 'react-i18next';


interface CategoryCarouselProps {
    categories: Category[];
}

const CategoryList: React.FC<CategoryCarouselProps> = ({ categories }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const sanitizeSVG = (svgContent: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (svg) {
            svg.removeAttribute('width');
            svg.removeAttribute('height');
        }
        return svg?.outerHTML || svgContent;
    };
    const handleOpenCategory = (categoryName: string) => {
        // Set category in Redux filters
        dispatch(
            setFilters({
                category: categoryName,
                minPrice: null,
                maxPrice: null,
                characteristics: {}, // Reset other filters
            })
        );

        // Navigate to the shop page
        navigate('/products');
        window.scrollTo(0, 0);
    };


    return (
        <div className="bg-gray-100 p-8  shadow-md">
            {/* Title */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    {t("browse_by")} <span className="text-orange-500">{t("category")}</span>
                </h2>
            </div>

            {/* Category Grid */}
            <div className="my-6">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1.2}
                    loop={false}
                    centeredSlides={false}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 3 },
                    }}

                >
                    {categories.map((category) => (
                        <SwiperSlide key={category.id}>
                            <div
                                key={category.id}
                                className=" w-72 flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-3 hover:scale-105 transition-all duration-300 "
                                onClick={() => handleOpenCategory(category.name)}

                            >

                                <div
                                    className="text-orange-500 w-20 mb-2"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeSVG(category.icon || ''),
                                    }}
                                />


                                <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600">
                                    {category.name}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default CategoryList;
