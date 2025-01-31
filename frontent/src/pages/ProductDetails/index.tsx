import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../interfaces/product";
import ProductGallery from "../../Components/ProductGallery";
import { getProductDetails, getSimilarProducts } from "../../utils/api";
import ProductList from "../../Components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../redux/slices/basketSlice";
import { RootState } from "../../redux/store";
import CommentsList from "../../Components/CommentsList";
import { setFilters } from "../../redux/slices/filterSlice";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";

const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const { t } = useTranslation();



  const dispatch = useDispatch();
  const savedFilters = useSelector((state: RootState) => state.filters);

  const navigate = useNavigate();

  const productExists = useSelector((state: RootState) =>
    state.basket.items.some((item) => item.product.id === product?.id)
  );
  useEffect(() => {
    // Fetch product details by slug
    const fetchProducts = async (language: string) => {
      if (slug) {
        const result = await getProductDetails(slug, language);
        console.log("Product Details:", result);
        setProduct(result);

        const similar = await getSimilarProducts(slug);
        console.log("Similar Products:", similar);
        setSimilarProducts(similar);
      }
    };
    const handleLanguageChange = (language: string) => {
      fetchProducts(language);
    };

    fetchProducts(i18n.language);

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [slug, i18n]);

  if (!product) {
    return <div>Loading product details...</div>;
  }

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
            <path
              d="M12 18.77L18.18 22l-1.18-7.86 5-4.87-6.91-1.01L12 2v16.77z"
              className="fill-gray-200"
            />
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

  const handleAddToBasket = () => {
    dispatch(addItem({ product }));
  }
  const handleShowMore = () => {
    const filters = {
      ...savedFilters,
      category: product.category.name,

    };

    if (JSON.stringify(filters) !== JSON.stringify(savedFilters)) {
      dispatch(setFilters(filters));
    }
    navigate("/products");
    window.scrollTo(0, 0);
  }


  const handleBuyNow = () => {
    if (!productExists) {
      dispatch(addItem({ product }));
    }
    navigate("/order");
    window.scrollTo(0, 0);
  };
  return (
    <div className="  px-4 py-24">
      <div className="mt-12 max-w-7xl mx-auto grid gap-8 lg:grid-cols-2">
        {/* Left Section: Product Gallery */}
        <ProductGallery images={product.gallery} />

        {/* Right Section: Product Details */}
        <div className="relative">
          {renderDiscountBadge()}

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>
          {renderStars()}

          <p className="text-lg text-gray-600 mb-4">{product.category.name}</p>

          {/* Pricing */}
          <div className="flex items-center space-x-4 mb-4">
            {product.discounted_price !== product.price ? (
              <>
                <span className="text-orange-500 font-bold text-xl">
                  €{product.discounted_price}
                </span>
                <span className="text-gray-400 line-through">
                  €{product.price}
                </span>
              </>
            ) : (
              <span className="text-gray-500 font-bold text-xl">
                €{product.price}
              </span>
            )}
          </div>

          {/* Stock and Description */}
          <div className="space-y-2 mb-4">
            <p
              className={`${product.stock > 0 ? "text-green-500" : "text-red-500"
                } font-semibold`}
            >
              {product.stock > 0 ? t("in_stock") : t("out_of_stock")}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Characteristics */}
          <ul className="space-y-2 text-gray-700 mb-6">
            {product.characteristics.map((char, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-orange-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span>
                  <strong>{char.name}:</strong> {char.value} {char.suffix}
                </span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={handleAddToBasket} className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition">
              {t("add_to_basket")}
            </button>
            <button onClick={handleBuyNow} className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition">
              {t("buy_now")}
            </button>
          </div>
        </div>
      </div>
      <div>
        <CommentsList product_comments={product.comments} productId={product.id} />
      </div>
      <div className="mt-16 max-w-7xl mx-auto">
        {
          <ProductList
            products={similarProducts}
            title={t("similar")}
            subtitle={t("products")}
            description={null}
            onShowMore={handleShowMore}
          />
        }
      </div>
    </div>
  );
};

export default ProductDetailsPage;
