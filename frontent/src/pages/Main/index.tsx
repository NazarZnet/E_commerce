import { useEffect, useState } from "react";
import FeaturedProducts from "../../Components/FeaturedProducts";
import backgroundImage from "../../assets/images/header.webp";
import { getFeaturedProducts, getCategories, getPopularProducts } from '../../utils/api';
import CategoryList from "../../Components/CategoryList";
import ProductList from "../../Components/ProductList";
import { Product } from "../../interfaces/product";
import { Category } from "../../interfaces/category";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";
import Loader from "../../Components/Loader";


export default function Main() {

    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [popular, setPopular] = useState<Product[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchData(language: string) {
            setLoading(true);
            try {
                const [featuredProducts, categories, popularProducts] = await Promise.all([
                    getFeaturedProducts(language),
                    getCategories(language),
                    getPopularProducts(1.0, 5, language)
                ]);

                console.log("FeatureProducts:", featuredProducts);
                console.log("Categories:", categories);
                console.log("PopularProducts:", popularProducts);

                setFeaturedProducts(featuredProducts);
                setCategories(categories);
                setPopular(popularProducts);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        const handleLanguageChange = (language: string) => {
            fetchData(language)
        };

        fetchData(i18n.language)

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [i18n]);
    const handleShowMorePopular = () => {
        navigate("/products");
        window.scrollTo(0, 0);
    }
    if (loading) {
        return <div><Loader /></div>
    }


    return (
        <div>
            <header className="relative bg-gray-900 text-white">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={backgroundImage}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        {t("header_tag_one")} <span className="text-orange-500">{t("header_tag_two")}</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        {t("header_text")}
                    </p>
                    {/* Call-to-Action Button */}
                    <div className="space-x-4">
                        <a
                            href="#featured_products"
                            className="bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-orange-600 transition"
                        >
                            {t("shop_now")}
                        </a>
                    </div>
                </div>
            </header>
            {featuredProducts && featuredProducts.length > 0 && (
                <FeaturedProducts products={featuredProducts} />
            )}

            {categories && categories.length > 0 && (
                <CategoryList categories={categories} />
            )}

            {popular && popular.length > 0 && (
                <div className="w-full px-6 py-12 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg">

                    <ProductList products={popular} title={t("popular")} subtitle={t("products")} description={t("popular_products_text")} onShowMore={handleShowMorePopular} />
                </div>
            )}


        </div>
    );
}

