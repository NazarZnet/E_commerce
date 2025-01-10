import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Product } from "../../interfaces/product";
import { getCategories } from "../../utils/api";
import Filters from "../../Components/Filters";
import ProductCard from "../../Components/ProductCart";
import { Category } from "../../interfaces/category";

const ProductListPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [maxProductPrice, setMaxProductPrice] = useState<number>(5000);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Categories info:", data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          console.log("Products: ", data);
          setProducts(data.results);
          setFilteredProducts(data.results);
          const maxPrice = Math.max(
            ...data.results.map((p: Product) => p.price),
          );
          setMaxProductPrice(maxPrice);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter by category if categorySlug is present
    if (categorySlug) {
      const categoryFilteredProducts = products.filter(
        (product) => product.category.slug === categorySlug,
      );
      setFilteredProducts(categoryFilteredProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [categorySlug, products]);

  const handleFilterChange = useCallback(
    (filters: {
      category: string | null;
      minPrice: number | null;
      maxPrice: number | null;
      characteristics?: Record<string, string | number | boolean | { min?: number; max?: number }>;
    }) => {
      console.log("Filters received:", filters);

      let updatedProducts = [...products];

      // Filter by category
      if (filters.category) {
        updatedProducts = updatedProducts.filter(
          (product) => product.category.name === filters.category
        );
        console.log(`Filtered by category (${filters.category}):`, updatedProducts);
      }

      // Filter by price range
      if (filters.minPrice !== null) {
        updatedProducts = updatedProducts.filter(
          (product) => product.discounted_price >= filters.minPrice
        );
        console.log(`Filtered by min price (${filters.minPrice}):`, updatedProducts);
      }

      if (filters.maxPrice !== null) {
        updatedProducts = updatedProducts.filter(
          (product) => product.discounted_price <= filters.maxPrice
        );
        console.log(`Filtered by max price (${filters.maxPrice}):`, updatedProducts);
      }

      // Filter by characteristics
      if (filters.characteristics) {
        Object.entries(filters.characteristics).forEach(([key, filterValue]) => {
          console.log(`Applying filter for characteristic: ${key}, value:`, filterValue);
          console.log("Type:", typeof filterValue);
          updatedProducts = updatedProducts.filter((product) => {
            const characteristic = product.characteristics.find(
              (char) => char.name === key
            );

            if (!characteristic) {
              console.log(`Characteristic (${key}) not found in product:`, product);
              return false;
            }

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
              console.log(
                `Checking if ${numericValue} is between ${min} and ${max}`
              );
              return numericValue >= min && numericValue <= max;
            }

            // Handle exact match filter for strings
            return characteristic.value === String(filterValue);
          });
          console.log(`Filtered by characteristic (${key}):`, updatedProducts);
        });
      }

      console.log("Final filtered products:", updatedProducts);
      setFilteredProducts(updatedProducts);
    },
    [products]
  );



  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <Filters
          categories={categories}
          onFilterChange={handleFilterChange}
          maxProductPrice={maxProductPrice}
        />

        {/* Products Section */}
        <div className="mt-40 grid grid-cols-4 col-span-4 gap-6">
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
    </div>
  );
};

export default ProductListPage;
