import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Product } from "../../interfaces/product";
import { getAllProducts, getCategories } from "../../utils/api";
import Filters from "../../Components/Filters";
import ProductCard from "../../Components/ProductCart";
import { Category } from "../../interfaces/category";
import { RootState } from "../../redux/store";
import i18n from "../../i18n/config";
import Loader from "../../Components/Loader";

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [maxProductPrice, setMaxProductPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const filters = useSelector((state: RootState) => state.filters);


  useEffect(() => {

    const fetchData = async (language: string) => {
      setLoading(true);
      try {

        const [categoriesData, productsData] = await Promise.all([
          getCategories(language),
          getAllProducts(language),
        ]);

        setCategories(categoriesData);
        setProducts(productsData.results);
        setFilteredProducts(productsData.results);

        const maxPrice = Math.max(...productsData.results.map((p: Product) => p.price), 0);
        setMaxProductPrice(maxPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleLanguageChange = (language: string) => {
      fetchData(language)
    };

    fetchData(i18n.language)

    // Listen for language changes
    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };

  }, [i18n]);

  // Apply filters to products
  useEffect(() => {
    if (!products.length) return;
    console.log("Receive filters: ", filters);
    let updatedProducts = [...products];

    // Filter by category
    if (filters.category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.name === filters.category
      );
    }

    // Filter by price range
    if (filters.minPrice ?? false) {
      updatedProducts = updatedProducts.filter(
        (product) => product.discounted_price >= (filters.minPrice as number)
      );
    }
    if (filters.maxPrice ?? false) {
      updatedProducts = updatedProducts.filter(
        (product) => product.discounted_price <= (filters.maxPrice as number)
      );
    }

    // Filter by characteristics
    if (filters.characteristics) {
      Object.entries(filters.characteristics).forEach(([key, filterValue]) => {
        updatedProducts = updatedProducts.filter((product) => {
          const characteristic = product.characteristics.find(
            (char) => char.name === key
          );

          if (!characteristic) return false;

          // Handle boolean filter
          if (typeof filterValue === "boolean") {
            return filterValue === (characteristic.value.toLowerCase() === "true");
          }

          // Handle numeric range filter
          if (
            typeof filterValue === "object" &&
            "min" in filterValue &&
            "max" in filterValue
          ) {
            const numericValue = Number(characteristic.value);
            const min = filterValue.min ?? -Infinity;
            const max = filterValue.max ?? Infinity;
            return numericValue >= min && numericValue <= max;
          }

          // Handle string filters
          if (typeof filterValue === "string") {
            const selectedValues = filterValue.split(",");
            return selectedValues.includes(characteristic.value);
          }

          return false;
        });
      });
    }

    setFilteredProducts(updatedProducts);
  }, [filters, products]);


  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {loading ? (<Loader />) : (
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Section */}
          {maxProductPrice !== null && (
            <Filters
              categories={categories}
              maxProductPrice={maxProductPrice}
            />
          )}

          {/* Products Section */}
          <div className="mt-40 w-full grid justify-items-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 col-span-4  gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopPage;