import React from "react";
import { Product } from "../interfaces/product";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/basketSlice";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const renderDiscountBadge = () => {
        if (product.discount_percentage && product.discount_percentage > 0) {
            return (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded-full z-10">
                    -{product.discount_percentage}%
                </div>
            );
        }
        return null;
    };

    const renderStars = () => {
        const filledStars = Math.floor(product.average_rating);
        const halfStar = product.average_rating % 1 >= 0.5;
        const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

        return (
            <div className="  flex items-center gap-1 mt-1 text-orange-500">
                {Array(filledStars)
                    .fill(0)
                    .map((_, index) => (
                        <svg
                            key={`filled-${index}`}
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ))}
                {halfStar && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                        <path d="M12 18.77L18.18 22l-1.18-7.86 5-4.87-6.91-1.01L12 2v16.77z" className="fill-gray-200" />
                    </svg>
                )}
                {Array(emptyStars)
                    .fill(0)
                    .map((_, index) => (
                        <svg
                            key={`empty-${index}`}
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 fill-current text-gray-300"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ))}
            </div>
        );
    };

    const goToDetails = (slug: string) => {
        navigate(`/products/${slug}`);
        window.scrollTo(0, 0);
    }

    const handleAddToBasket = () => {
        dispatch(addItem({ product }));
    }

    return (
        <div className="relative w-[300px] h-[470px] bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
            {/* Discount Badge */}
            {renderDiscountBadge()}
            {/* Product Image */}
            <div className="relative h-[65%]">
                <img
                    src={product.gallery[0]?.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Product Details */}
            <div className="h-[30%] p-2 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-800 cursor-pointer" onClick={() => goToDetails(product.slug)}>{product.name}</h3>
                {renderStars()}
                <div className="flex items-center justify-between mt-1">
                    {product.discounted_price !== product.price ? (
                        <>
                            <span className="text-gray-400 line-through">
                                €{product.price}
                            </span>
                            <span className="text-orange-500 font-bold">
                                €{product.discounted_price}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-500">${product.price}</span>
                    )}
                </div>
                <div className="flex gap-1 mt-3">
                    <button onClick={handleAddToBasket} className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition w-full">
                        {t("add_to_basket")}
                    </button>
                    <button className="group bg-transparent border border-orange-500 text-orange-500 p-2 rounded-lg hover:bg-orange-500 hover:text-white transition w-full"
                        onClick={() => goToDetails(product.slug)}
                    >
                        {t("details_btn")}
                        {/* Description Overlay */}
                        <div className="absolute inset-0 h-[65%] bg-black bg-opacity-60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0 overflow-hidden -z-10 group-hover:z-20">
                            <p className="p-4 text-sm line-clamp-[12] overflow-hidden text-ellipsis">
                                {product.description}
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ProductCard;
