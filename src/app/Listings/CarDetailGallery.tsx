"use client";
import Image from "next/image";
import { useCarStore } from "./useCarStore";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarDetailGallery() {
  const { selectedCar } = useCarStore();
  const images = selectedCar?.galleryImages ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden">
        <Image
          src={images[currentIndex].url}
          alt="Car image"
          fill
          className="object-cover"
        />

        <button
          onClick={handlePrev}
          className="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`w-20 h-14 rounded-md overflow-hidden cursor-pointer border-2 ${
              idx === currentIndex ? "border-orange-500" : "border-transparent"
            }`}
          >
            <Image
              src={img.url}
              alt={`Thumbnail ${idx}`}
              width={80}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
