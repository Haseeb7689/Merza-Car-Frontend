"use client";
import Image from "next/image";
import { CarListing } from "@/utils/apiCarGet";
import useMediaQuery from "./useMediaQuery";
import { useCarStore } from "./useCarStore";
import { useRouter } from "next/navigation";

export default function CarCards({
  isListView,
  cars,
}: {
  isListView: boolean;
  cars: CarListing[];
}) {
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const handleCardClick = (car: CarListing) => {
    useCarStore.getState().setSelectedCar({
      title: car.title,
      galleryImages: car.galleryImages,
      price: car.price ?? 0,
      year: car.year ?? 0,
      mileage: car.mileage ?? 0,
      transmission: car.transmission ?? "",
      fuelType: car.fuelType ?? "",
      driveType: car.driveType ?? "",
    });

    router.push("/car-details");
  };

  return (
    <div className="flex flex-wrap mx-3 mt-10">
      {cars.map((car) => (
        <div
          key={car.id}
          className={`px-3 mb-6 ${
            isListView ? "w-full" : "w-full sm:w-1/2 lg:w-1/3"
          }`}
        >
          {isListView && isMdUp ? (
            <div
              className="flex p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-whiteborder hover:border-orange-500 cursor-pointer"
              onClick={() => handleCardClick(car)}
            >
              <div className="relative w-1/3 min-w-[200px] h-full overflow-hidden rounded-md ">
                <Image
                  src={`${car.galleryImages?.[0]?.url}`}
                  alt="car image"
                  width={300}
                  height={150}
                  className="h-[150px] w-[300px] object-cover rounded-md"
                />
                {car.galleryImages?.length > 1 && (
                  <div className="absolute top-1 right-30 bg-orange-600/80 text-white text-xs px-2 py-[2px] rounded-md shadow">
                    +{car.galleryImages.length - 1} photos
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {car.title}
                  </h3>
                  <p className="text-lg text-gray-500 mb-1 line-clamp-2">
                    {car.features
                      ?.map((f) => f?.name)
                      .filter(Boolean)
                      .join(", ") ?? ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-lg text-gray-600 mt-2">
                  <span className="bg-orange-500 text-white px-2 py-[2px] rounded-sm font-semibold">
                    {car.year ?? "—"}
                  </span>
                  <ul className="list-disc flex gap-10 ml-6 [&>li]:pl-0.5">
                    {car.mileage && (
                      <li>{car.mileage.toLocaleString()} miles</li>
                    )}
                    {car.transmission && <li>{car.transmission}</li>}
                    {car.fuelType && <li>{car.fuelType}</li>}
                    {car.driveType && <li>{car.driveType}</li>}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end text-end">
                <p className="text-2xl font-extrabold text-orange-600">
                  د.إ {car.price?.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="group block rounded-lg shadow-md p-4 bg-white border hover:shadow-xl hover:cursor-pointer transition-all hover:border-orange-500"
              onClick={() => handleCardClick(car)}
            >
              <div className="relative h-[200px] w-full mb-4 overflow-hidden rounded-md">
                <Image
                  src={`${car.galleryImages?.[0]?.url}`}
                  alt="car image"
                  width={400}
                  height={200}
                  priority
                  className="h-[200px] w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 rounded-md"
                />
                {car.galleryImages?.length > 1 && (
                  <div className="absolute top-2 right-2 bg-orange-500/70 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                    +{car.galleryImages.length - 1} photos
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-light tracking-wide mb-1">
                {car.title}
              </h3>
              {car.price && (
                <p className="text-xl font-bold text-gray-800 mb-2">
                  د.إ {car.price.toLocaleString()}
                </p>
              )}
              <hr />
              <div className="flex items-center gap-6 lg:gap-8 text-sm text-gray-600 space-y-1 mt-3">
                <p className="bg-orange-600 text-white font-bold p-1 border rounded-sm w-20 flex justify-center">
                  {car.year ?? "—"}
                </p>
                <p>{car.mileage?.toLocaleString() ?? "—"} miles</p>
                <p>{car.transmission ?? "—"}</p>
                <p>{car.fuelType ?? "—"}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
