import React, { useState, useEffect, useRef } from "react";
import { Category, CategoryCharacteristic } from "../interfaces/category";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setFilters } from "../redux/slices/filterSlice";
import { useTranslation } from "react-i18next";

interface FiltersProps {
  categories: Category[];
  maxProductPrice: number;
}

const Filters: React.FC<FiltersProps> = ({ categories, maxProductPrice }) => {
  const dispatch = useDispatch();
  const savedFilters = useSelector((state: RootState) => state.filters);

  const { t } = useTranslation();


  const [showFilters, setShowFilters] = useState(false);
  const [characteristicFilters, setCharacteristicFilters] = useState<
    Record<string, string | number | boolean | { min?: number; max?: number }>
  >({});
  const [priceRange, setPriceRange] = useState<[number, number]>([
    savedFilters.minPrice ?? 0,
    savedFilters.maxPrice ?? maxProductPrice,
  ]);

  const selectedCategory = savedFilters.category;
  const currentCategory = categories.find(
    (category) => category.name === selectedCategory
  );

  // Ref to track whether the initial mount has completed
  const isInitialized = useRef(false);

  // Sync characteristic filters with the selected category
  useEffect(() => {
    if (currentCategory?.characteristics) {
      const relevantCharacteristics = new Set(
        currentCategory.characteristics.map((char) => char.name)
      );

      const filteredCharacteristics = Object.keys(savedFilters.characteristics)
        .filter((key) => relevantCharacteristics.has(key))
        .reduce((acc, key) => {
          acc[key] = savedFilters.characteristics[key];
          return acc;
        }, {} as typeof savedFilters.characteristics);

      const newCharacteristicFilters = { ...filteredCharacteristics };

      currentCategory.characteristics.forEach((characteristic) => {
        if (!(characteristic.name in newCharacteristicFilters)) {
          if (characteristic.data_type === "integer") {
            const maxCharacteristicValue = categories
              .flatMap((category) => category.products)
              .flatMap((product) => product.characteristics)
              .filter((char) => char.name === characteristic.name)
              .reduce((max, char) => {
                const numericValue = Number(char.value);
                return isNaN(numericValue) ? max : Math.max(max, numericValue);
              }, 0);

            newCharacteristicFilters[characteristic.name] = {
              min: 0,
              max: maxCharacteristicValue || 100,
            };
          } else if (characteristic.data_type === "boolean") {
            newCharacteristicFilters[characteristic.name] = false;
          } else if (characteristic.data_type === "string") {
            const allValues = [
              ...new Set(
                categories
                  .flatMap((cat) => cat.products)
                  .flatMap((prod) => prod.characteristics)
                  .filter((char) => char.name === characteristic.name)
                  .map((char) => char.value)
              ),
            ];
            newCharacteristicFilters[characteristic.name] = allValues.join(",");
          }
        }
      });

      setCharacteristicFilters(newCharacteristicFilters);
    }
  }, [currentCategory, categories, savedFilters.characteristics]);
  useEffect(() => {
    if (!selectedCategory) {
      setCharacteristicFilters({});
    }
  }, [selectedCategory]);

  // Sync Redux state with local state when changes occur
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const filters = {
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      characteristics: characteristicFilters,
    };

    if (JSON.stringify(filters) !== JSON.stringify(savedFilters)) {
      dispatch(setFilters(filters));
    }
  }, [selectedCategory, priceRange, characteristicFilters, dispatch, savedFilters]);

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean
  ) => {
    const value = Number(e.target.value);
    setPriceRange((prev) =>
      isMin ? [value, prev[1]] : [prev[0], value]
    );
  };

  const handleCharacteristicChange = (
    characteristic: CategoryCharacteristic,
    value: string | number | boolean | { min?: number; max?: number }
  ) => {
    const updatedCharacteristics = {
      ...characteristicFilters,
      [characteristic.name]: value,
    };

    setCharacteristicFilters(updatedCharacteristics);
    dispatch(
      setFilters({
        ...savedFilters,
        characteristics: updatedCharacteristics,
      })
    );
  };

  const handleCheckboxChange = (
    characteristic: CategoryCharacteristic,
    value: string
  ) => {
    setCharacteristicFilters((prev) => {
      const currentValue = prev[characteristic.name] as string;
      const selectedValues = currentValue ? currentValue.split(",") : [];
      const updatedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value) // Uncheck
        : [...selectedValues, value]; // Check

      return {
        ...prev,
        [characteristic.name]: updatedValues.join(","),
      };
    });
  };
  return (
    <div className="absolute top-20 left-0 z-40 w-full">
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition w-36"
      >
        {t("filters")}
      </button>

      {showFilters && (
        <div className="absolute bg-white p-4 rounded-lg shadow-md w-full md:w-[400px] mt-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t("filters")}</h2>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">{t("category")}</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                dispatch(
                  setFilters({
                    ...savedFilters,
                    category: e.target.value || null,
                  })
                )
              }
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">{t("all_categories")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">{t("price_range")}</label>
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
                value={priceRange[0]}
                onChange={(e) =>
                  dispatch(
                    setFilters({
                      ...savedFilters,
                      minPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  )
                }
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  dispatch(
                    setFilters({
                      ...savedFilters,
                      maxPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  )
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
                    value={
                      (characteristicFilters[characteristic.name] as any)?.min ??
                      ""
                    }
                    onChange={(e) =>
                      handleCharacteristicChange(characteristic, {
                        ...(characteristicFilters[characteristic.name] || {}),
                        min: Number(e.target.value),
                      })
                    }
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={
                      (characteristicFilters[characteristic.name] as any)?.max ??
                      ""
                    }
                    onChange={(e) =>
                      handleCharacteristicChange(characteristic, {
                        ...(characteristicFilters[characteristic.name] || {}),
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
                      checked={
                        characteristicFilters[characteristic.name] === true
                      }
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
                      checked={
                        characteristicFilters[characteristic.name] === false
                      }
                      onChange={() =>
                        handleCharacteristicChange(characteristic, false)
                      }
                    />
                    No
                  </label>
                </div>
              ) : characteristic.data_type === "string" ? (
                <div className="flex flex-col">
                  {[...new Set(
                    categories
                      .flatMap((cat) => cat.products)
                      .flatMap((prod) => prod.characteristics)
                      .filter((char) => char.name === characteristic.name)
                      .map((char) => char.value)
                  )].map((value) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          (characteristicFilters[characteristic.name] || "")
                            .split(",")
                            .includes(value)
                        }
                        onChange={() =>
                          handleCheckboxChange(characteristic, value)
                        }
                      />
                      {value}
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          <button
            onClick={() => {
              dispatch(
                setFilters({
                  category: null,
                  minPrice: 0,
                  maxPrice: maxProductPrice,
                  characteristics: {},
                })
              );
            }}
            className="bg-transparent border border-orange-500 text-orange-500 py-2 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition w-full"
          >
            {t("clear_filters")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;