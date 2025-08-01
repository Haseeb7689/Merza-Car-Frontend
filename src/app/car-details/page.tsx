"use client";

import { useCarStore } from "@/app/Listings/useCarStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CarDetailGallery from "../Listings/CarDetailGallery";

export default function CarDetailsPage() {
  const { selectedCar } = useCarStore();
  const router = useRouter();

  useEffect(() => {
    if (!selectedCar) {
      router.push("/");
    }
  }, [selectedCar]);

  if (!selectedCar) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="cursor-pointer text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-10">
              <CarDetailGallery />

              <h2 className="text-2xl mt-5 font-semibold mb-4 text-gray-900">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This {selectedCar.year} {selectedCar.title} is in excellent
                condition with only {selectedCar.mileage} miles on the odometer.
                Features {selectedCar.transmission} transmission and{" "}
                {selectedCar.fuelType} engine with {selectedCar.driveType}{" "}
                drivetrain. Well-maintained and ready for its next owner.
                Perfect for those looking for reliability and performance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-4xl font-bold text-gray-900">
                {selectedCar.title}
              </h1>
              <p className="text-3xl font-bold text-green-600 mt-2">
                د.إ {selectedCar.price}
              </p>
              <h2 className="text-2xl mt-5 font-semibold mb-6 text-gray-900">
                Vehicle Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Year</span>
                  <span className="font-semibold text-gray-900">
                    {selectedCar.year}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Mileage</span>
                  <span className="font-semibold text-gray-900">
                    {selectedCar.mileage} miles
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">
                    Transmission
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedCar.transmission}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Fuel Type</span>
                  <span className="font-semibold text-gray-900">
                    {selectedCar.fuelType}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="font-medium text-gray-600">Drive Type</span>
                  <span className="font-semibold text-gray-900">
                    {selectedCar.driveType}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button className="cursor-pointer w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Contact Seller
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Why Choose This Car?
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-700">Verified condition</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-700">
                    Service records available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-700">Clean title</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-700">Accident-free history</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
