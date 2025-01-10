import { useEffect, useState } from "react";
import FeaturedProducts from "../../Components/FeaturedProducts";
import backgroundImage from "../../assets/images/header.webp";
import { getFeaturedProducts, getCategories, getPopularProducts } from '../../utils/api';
import CategoryList from "../../Components/CategoryList";
import ProductList from "../../Components/ProductList";

export default function Main() {

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        async function getProducts() {
            const result = await getFeaturedProducts();
            console.log("FeatureProducts:", result);
            setFeaturedProducts(result);
        }

        async function getCategoryList() {
            const result = await getCategories();
            console.log("Categories:", result);
            setCategories(result);
        }

        async function getPopular() {
            const result = await getPopularProducts(1.0, 2);
            console.log("PopularProducts:", result);
            setPopular(result);
        }

        getProducts();
        getCategoryList();
        getPopular();
    }, []);


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
                        Ride Into <span className="text-orange-500">The Future</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Discover cutting-edge electric scooters and bikes for the modern world.
                    </p>
                    {/* Call-to-Action Button */}
                    <div className="space-x-4">
                        <a
                            href="#featured_products"
                            className="bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-orange-600 transition"
                        >
                            Shop Now
                        </a>
                        <a
                            href="#learn-more"
                            className="bg-transparent border border-white py-3 px-6 rounded-lg text-lg hover:bg-white hover:text-gray-900 transition"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </header>
            {featuredProducts && featuredProducts.length > 0 && (
                <FeaturedProducts products={featuredProducts.slice(0, 4)} />
            )}

            {categories && categories.length > 0 && (
                <CategoryList categories={categories} />
            )}

            {popular && popular.length > 0 && (
                <div className="w-full px-6 py-12 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg">

                    <ProductList products={popular} title="Popular" subtitle="Products" description="Discover our best-selling product loved by customers worldwide." />
                </div>
            )}


        </div>
    );
}

