import React, { useState, useEffect } from "react";

interface FiltersProps {
  categories: string[];
  maxProductPrice: number; // Pass max product price as a prop
  onFilterChange: (filters: {
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  maxProductPrice,
  onFilterChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>(maxProductPrice.toString());
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    maxProductPrice,
  ]);

  useEffect(() => {
    // Trigger onFilterChange whenever filters are updated
    onFilterChange({
      category: selectedCategory,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
  }, [selectedCategory, minPrice, maxPrice, onFilterChange]);

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean,
  ) => {
    const value = Number(e.target.value);
    if (isMin) {
      setMinPrice(value.toString());
      setPriceRange([value, priceRange[1]]);
    } else {
      setMaxPrice(value.toString());
      setPriceRange([priceRange[0], value]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean,
  ) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      if (isMin) {
        setMinPrice(value);
        setPriceRange([value ? Number(value) : 0, priceRange[1]]);
      } else {
        setMaxPrice(value);
        setPriceRange([priceRange[0], value ? Number(value) : maxProductPrice]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFilterChange({
        category: selectedCategory,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
      });
    }
  };

  return (
    <div className="absolute top-20 left-0 z-40">
      {/* Filters Button */}
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition w-full"
      >
        Filters
      </button>

      {/* Filters List */}
      {showFilters && (
        <div className="absolute bg-white p-4 rounded-lg shadow-md w-[400px] mt-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Category</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)} // Directly update state
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Price Range</label>
            <div className="flex items-center gap-2">
              {/* Min Slider */}
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceRange[0]}
                onChange={(e) => handleSliderChange(e, true)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={(e) => handleSliderChange(e, false)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => handleInputChange(e, true)}
                onKeyDown={handleKeyDown}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => handleInputChange(e, false)}
                onKeyDown={handleKeyDown}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setMinPrice("0");
              setMaxPrice(maxProductPrice.toString());
              setPriceRange([0, maxProductPrice]);
              onFilterChange({
                category: null,
                minPrice: null,
                maxPrice: null,
              });
            }}
            className="bg-transparent border border-orange-500 text-orange-500 py-2 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition w-full"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
