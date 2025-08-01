"use client";
import React, { useEffect, useState } from "react";
import rawCarData from "./../AddCarsForm/data/carData.json";
import FeatureSelector from "./FeatureSelector";
import { FaSearch } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { TbLayoutListFilled } from "react-icons/tb";
import CarCards from "@/app/Listings/CarCard";
import { CarListing, fetchCarListings } from "@/utils/apiCarGet";

export default function Listings() {
  const [isListView, setIsListView] = useState(false);
  const carData = rawCarData as { [key: string]: string[] };
  const carMakes = Object.keys(carData);
  const [allCars, setAllCars] = useState<CarListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [totalCars, setTotalCars] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [filteredCars, setFilteredCars] = useState<CarListing[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [conditionFilter, setConditionFilter] = useState<
    "All" | "New" | "Used"
  >("All");
  const [featureSearch, setFeatureSearch] = useState("");
  const initialFilters = {
    type: "",
    make: "",
    model: "",
    year: "",
    driveType: "",
    transmission: "",
    fuelType: "",
    mileage: "",
    engineSize: "",
    cylinders: "",
    colors: "",
    doors: "",
    vin: "",
    price: "",
    features: [],
  };
  const [filters, setFilters] = useState(initialFilters);
  const availableTypes = Array.from(
    new Set(allCars.map((car) => car?.type).filter(Boolean))
  );
  const availableMakes = Array.from(
    new Set(allCars.map((car) => car?.make).filter(Boolean))
  );

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const { data, total } = await fetchCarListings(currentPage, cardsPerPage);
      setAllCars(data);
      setFilteredCars(data);
      setTotalCars(total);
      setIsLoading(false);
    };

    loadData();
  }, [currentPage, cardsPerPage]);

  useEffect(() => {
    const result = allCars.filter((car) => {
      const carFeatureNames =
        car.features?.map((f) => f?.name?.toLowerCase()) ?? [];

      const matchesFeatures =
        selectedFeatures.length === 0 ||
        selectedFeatures.every((feature) =>
          carFeatureNames.includes(feature.toLowerCase())
        );

      const matchesFeatureSearch =
        featureSearch.trim() === "" ||
        carFeatureNames.some((name) =>
          name.includes(featureSearch.toLowerCase())
        );

      const matchesCondition =
        conditionFilter === "All" ||
        car.condition?.toLowerCase() === conditionFilter.toLowerCase();

      return (
        matchesCondition &&
        matchesFeatureSearch &&
        matchesFeatures &&
        (!filters.type || car.type === filters.type) &&
        (!filters.make || car.make === filters.make) &&
        (!filters.model || car.model === filters.model) &&
        (!filters.year || car.year?.toString() === filters.year) &&
        (!filters.driveType || car.driveType === filters.driveType) &&
        (!filters.transmission || car.transmission === filters.transmission) &&
        (!filters.fuelType || car.fuelType === filters.fuelType) &&
        (!filters.mileage || car.mileage?.toString() === filters.mileage) &&
        (!filters.engineSize ||
          car.engineSize?.toString() === filters.engineSize) &&
        (!filters.cylinders ||
          car.cylinders?.toString() === filters.cylinders) &&
        (!filters.colors || car.colors?.includes(filters.colors)) &&
        (!filters.doors || car.doors?.toString() === filters.doors) &&
        (!filters.vin || car.vin?.includes(filters.vin)) &&
        (!filters.price ||
          (!isNaN(Number(filters.price)) &&
            car.price != null &&
            car.price <= parseFloat(filters.price)))
      );
    });

    setFilteredCars(result);
  }, [filters, allCars, selectedFeatures, conditionFilter, featureSearch]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const hasModels = filters.make && carData[filters.make]?.length > 0;
  const isModelDisabled = !filters.make || !hasModels;

  const currentCars = filteredCars;
  const totalPages = Math.ceil(totalCars / cardsPerPage);
  const safeTotalPages = Number.isFinite(totalPages) ? totalPages : 1;
  const pageNumbers = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <div className="flex-1 md:mr-14">
      <div className="bg-gray-100 shadow-lg overflow-hidden">
        <div className="space-y-4 max-w-full mx-auto p-10 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label htmlFor="type" className="block text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {[
                  "sedan",
                  "suv",
                  "hatchback",
                  "coupe",
                  "convertible",
                  "pickup",
                  "minivan",
                ].map((type) => (
                  <option
                    key={type}
                    value={type}
                    disabled={!availableTypes.includes(type)}
                    className={
                      !availableTypes.includes(type) ? "text-gray-400" : ""
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="make" className="block text-gray-700 mb-2">
                Make
              </label>
              <select
                id="make"
                name="make"
                value={filters.make}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Make</option>
                {carMakes.map((makeKey) => (
                  <option
                    key={makeKey}
                    value={makeKey}
                    disabled={!availableMakes.includes(makeKey)}
                    className={
                      !availableMakes.includes(makeKey) ? "text-gray-400" : ""
                    }
                  >
                    {makeKey.charAt(0).toUpperCase() + makeKey.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="model" className="block text-gray-700 mb-2">
                Model
              </label>
              <select
                id="model"
                name="model"
                value={filters.model}
                onChange={handleFilterChange}
                disabled={isModelDisabled}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
    ${
      isModelDisabled
        ? "bg-gray-100 cursor-not-allowed text-gray-500"
        : "bg-white text-black"
    }
  `}
              >
                {!filters.make && <option value="">Select Make First</option>}

                {filters.make && hasModels ? (
                  <>
                    <option value="">Select Model</option>
                    {carData[filters.make].map((m) => {
                      const isModelAvailable = allCars.some(
                        (car) => car.make === filters.make && car.model === m
                      );
                      return (
                        <option key={m} value={m} disabled={!isModelAvailable}>
                          {m}
                        </option>
                      );
                    })}
                  </>
                ) : (
                  filters.make && <option value="">No models available</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                  د.إ
                </span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="year" className="block text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="driveType" className="block text-gray-700 mb-2">
                Drive Type
              </label>
              <select
                name="driveType"
                id="driveType"
                value={filters.driveType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {[
                  { value: "awd", label: "AWD/4WD" },
                  { value: "fwd", label: "Front Wheel Drive" },
                  { value: "rwd", label: "Rear Wheel Drive" },
                ].map((option) => {
                  const isAvailable = allCars.some(
                    (car) => car.driveType === option.value
                  );

                  return (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={!isAvailable}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label
                htmlFor="transmission"
                className="block text-gray-700 mb-2"
              >
                Transmission
              </label>
              <select
                name="transmission"
                id="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {[
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                  { value: "semiAutomatic", label: "Semi-Automatic" },
                ].map((option) => {
                  const isAvailable = allCars.some(
                    (car) => car.transmission === option.value
                  );

                  return (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={!isAvailable}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="fuelType" className="block text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                name="fuelType"
                id="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {[
                  { value: "diesel", label: "Diesel" },
                  { value: "electric", label: "Electric" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "petrol", label: "Petrol" },
                ].map((option) => {
                  const isAvailable = allCars.some(
                    (car) => car.fuelType?.toLowerCase() === option.value
                  );

                  return (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={!isAvailable}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="mileage" className="block text-gray-700 mb-2">
                Mileage
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                  miles
                </span>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  inputMode="numeric"
                  value={filters.mileage}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="engineSize" className="block text-gray-700 mb-2">
                Engine Size
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                  L
                </span>
                <input
                  type="number"
                  id="engineSize"
                  name="engineSize"
                  inputMode="numeric"
                  value={filters.engineSize}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cylinders" className="block text-gray-700 mb-2">
                Cylinders
              </label>
              <select
                name="cylinders"
                id="cylinders"
                value={filters.cylinders}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {[4, 6, 8].map((count) => {
                  const isAvailable = allCars.some(
                    (car) => String(car.cylinders) === String(count)
                  );

                  return (
                    <option key={count} value={count} disabled={!isAvailable}>
                      {count}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="colors" className="block text-gray-700 mb-2">
                Colors
              </label>
              <select
                name="colors"
                id="colors"
                value={filters.colors}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {[
                  "black",
                  "blue",
                  "brown",
                  "gold",
                  "green",
                  "gray",
                  "orange",
                  "pearlwhite",
                  "red",
                  "silver",
                  "white",
                  "yellow",
                ].map((color) => {
                  const isAvailable = allCars.some(
                    (car) => car.colors?.toLowerCase() === color
                  );

                  return (
                    <option key={color} value={color} disabled={!isAvailable}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="doors" className="block text-gray-700 mb-2">
                Doors
              </label>
              <select
                name="doors"
                id="doors"
                value={filters.doors}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                {[2, 3, 4, 5].map((doorCount) => {
                  const isAvailable = allCars.some(
                    (car) => Number(car.doors) === doorCount
                  );

                  return (
                    <option
                      key={doorCount}
                      value={doorCount}
                      disabled={!isAvailable}
                    >
                      {doorCount}-doors
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="vin" className="block text-gray-700 mb-2">
                VIN
              </label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={filters.vin}
                onChange={handleFilterChange}
                placeholder="Vehicle Identification Number"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <FeatureSelector
                selectedFeatures={selectedFeatures}
                setSelectedFeatures={setSelectedFeatures}
              />
            </div>
          </div>
          <button
            onClick={() => {
              setFilters(initialFilters);
              setSelectedFeatures([]);
              setFilteredCars(allCars);
            }}
            disabled={
              JSON.stringify(filters) === JSON.stringify(initialFilters) &&
              selectedFeatures.length === 0
            }
            className={`mt-4 px-4 py-2 rounded-md shadow-sm transition ${
              JSON.stringify(filters) === JSON.stringify(initialFilters) &&
              selectedFeatures.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-orange-500"
                : "text-white bg-orange-500 hover:bg-orange-400 cursor-pointer"
            }`}
          >
            Clear Filters
          </button>
        </div>
        <hr />
        <div className="flex flex-col gap-3 items-center md:flex-row justify-between mt-2 mb-3 mr-10 ml-10">
          <div className="text-2xl flex gap-10">
            {["All", "New", "Used"].map((item) => (
              <span
                key={item}
                onClick={() =>
                  setConditionFilter(item as "All" | "New" | "Used")
                }
                className={`relative cursor-pointer hover:text-orange-500
        before:content-[''] before:absolute before:-top-2 md:before:-top-7
        before:left-0 before:h-[3px] before:w-full before:bg-orange-500
        before:scale-x-0 hover:before:scale-x-100
        before:transition-transform before:duration-300 before:origin-center
        ${conditionFilter === item ? "text-orange-500 before:scale-x-100" : ""}
      `}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search features..."
              value={featureSearch}
              onChange={(e) => setFeatureSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center md:flex-row justify-between mt-10 mb-3 mr-10 ml-10">
        <div>
          <span className="text-xl md:text-3xl font-bold">Result</span>
        </div>
        <div className="hidden md:flex items-center  gap-3">
          <BsFillGridFill
            className={`md:size-9 size-5 text-gray-400 hover:text-orange-500 cursor-pointer ${
              !isListView ? "text-orange-500" : ""
            }`}
            onClick={() => setIsListView(false)}
          />
          <TbLayoutListFilled
            className={`md:size-10 size-6 text-gray-400 hover:text-orange-500 cursor-pointer ${
              isListView ? "text-orange-500" : ""
            }`}
            onClick={() => setIsListView(true)}
          />
        </div>
      </div>
      <div className="mr-5 ml-5 md:mr-8 md:ml-8 lg:mr-10 lg:ml-10 mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Cars per page:{" "}
            <select
              value={cardsPerPage}
              onChange={(e) => {
                setCardsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 border rounded"
            >
              {[1, 2, 4, 8, 12, 16].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <CarCards isListView={isListView} cars={currentCars} />
        </div>

        <div className="flex justify-center items-center space-x-2 pt-4 mb-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 hover:cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
