import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Product } from "../../interfaces/product";
import { getCategories } from "../../utils/api";
import Filters from "../../Components/Filters";
import ProductCard from "../../Components/ProductCart";
import { Category } from "../../interfaces/category";
import { RootState } from "../../redux/store";

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [maxProductPrice, setMaxProductPrice] = useState<number | null>(null);
  const [forceRender, setForceRender] = useState(0);

  const filters = useSelector((state: RootState) => state.filters);


  useEffect(() => {
    // Fetch categories and products
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.results);
          setFilteredProducts(data.results);

          const maxPrice = Math.max(
            ...data.results.map((p: Product) => p.price),
            0
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

  // Apply filters to products
  useEffect(() => {
    console.log("Receive filters: ", filters);
    let updatedProducts = [...products];

    // Filter by category
    if (filters.category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.name === filters.category
      );
    }

    // Filter by price range
    if (filters.minPrice !== null) {
      updatedProducts = updatedProducts.filter(
        (product) => product.discounted_price >= filters.minPrice
      );
    }
    if (filters.maxPrice !== null) {
      updatedProducts = updatedProducts.filter(
        (product) => product.discounted_price <= filters.maxPrice
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
  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [filters]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
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
    </div>
  );
};

export default ShopPage;