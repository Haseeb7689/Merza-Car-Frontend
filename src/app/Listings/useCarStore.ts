import { create } from "zustand";

type CarDetails = {
  title: string;
  galleryImages: { url: string }[];
  price?: number;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  driveType?: string;
};

type CarStore = {
  selectedCar: CarDetails | null;
  setSelectedCar: (car: CarDetails) => void;
};

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: null,
  setSelectedCar: (car) => set({ selectedCar: car }),
}));
