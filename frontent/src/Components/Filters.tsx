import React, { useState, useEffect } from "react";
import { Category, CategoryCharacteristic } from "../interfaces/category";

interface FiltersProps {
  categories: Category[];
  maxProductPrice: number;
  onFilterChange: (filters: {
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    characteristics?: Record<string, string | number | boolean | { min?: number; max?: number }>;
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
  const [characteristicFilters, setCharacteristicFilters] = useState<
    Record<string, string | number | boolean | { min?: number; max?: number }>
  >({});
  const currentCategory = categories.find(
    (category) => category.name === selectedCategory
  );

  // Initialize characteristic filters based on the selected category
  useEffect(() => {
    if (currentCategory?.characteristics) {
      const initialCharacteristicFilters: Record<
        string,
        string | number | boolean | { min?: number; max?: number }
      > = {};

      currentCategory.characteristics.forEach((characteristic) => {
        if (characteristic.data_type === "integer") {
          initialCharacteristicFilters[characteristic.name] = { min: 0, max: 100 }; // Default min/max
        } else if (characteristic.data_type === "boolean") {
          initialCharacteristicFilters[characteristic.name] = false; // Default for boolean
        } else if (characteristic.data_type === "string") {
          initialCharacteristicFilters[characteristic.name] = ""; // Default for string
        }
      });

      setCharacteristicFilters(initialCharacteristicFilters);
    }
  }, [currentCategory]);

  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      characteristics: characteristicFilters,
    });
  }, [selectedCategory, minPrice, maxPrice, characteristicFilters, onFilterChange]);

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean
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

  const handleCharacteristicChange = (
    characteristic: CategoryCharacteristic,
    value: string | number | boolean | { min?: number; max?: number }
  ) => {
    setCharacteristicFilters((prev) => ({
      ...prev,
      [characteristic.name]: value,
    }));
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
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Price Range</label>
            <div className="flex items-center gap-2">
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
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Characteristic Filters */}
          {currentCategory?.characteristics.map((characteristic) => (
            <div key={characteristic.id} className="mb-4">
              <label className="block text-gray-600 mb-2">
                {characteristic.name}{" "}
                {characteristic.suffix && `(${characteristic.suffix})`}
              </label>
              {characteristic.data_type === "integer" ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={0}
                    onChange={(e) =>
                      handleCharacteristicChange(characteristic, {
                        ...characteristicFilters[characteristic.name],
                        min: Number(e.target.value),
                      })
                    }
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={100}
                    onChange={(e) =>
                      handleCharacteristicChange(characteristic, {
                        ...characteristicFilters[characteristic.name],
                        max: Number(e.target.value),
                      })
                    }
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                </div>
              ) : characteristic.data_type === "boolean" ? (
                <div className="flex items-center gap-2">
                  <label>
                    <input
                      type="radio"
                      name={characteristic.name}
                      value="true"
                      onChange={() =>
                        handleCharacteristicChange(characteristic, true)
                      }
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={characteristic.name}
                      value="false"
                      onChange={() =>
                        handleCharacteristicChange(characteristic, false)
                      }
                    />
                    No
                  </label>
                </div>
              ) : characteristic.data_type === "string" ? (
                <select
                  multiple
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    handleCharacteristicChange(characteristic, values.join(","));
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select</option>
                  {/* Mocked values; replace with dynamic */}
                  <option value="Value1">Value1</option>
                  <option value="Value2">Value2</option>
                </select>
              ) : null}
            </div>
          ))}

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setMinPrice("0");
              setMaxPrice(maxProductPrice.toString());
              setPriceRange([0, maxProductPrice]);
              setCharacteristicFilters({});
              onFilterChange({
                category: null,
                minPrice: null,
                maxPrice: null,
                characteristics: {},
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
