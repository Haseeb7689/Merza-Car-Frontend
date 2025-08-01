// types/CarListing.ts
export interface CarListing {
  id: string;
  title: string;
  condition: "new" | "used" | "certified";
  type?: string;
  make?: string;
  model?: string;
  price?: number;
  year?: number;
  driveType?: string;
  transmission?: string;
  fuelType?: string;
  mileage?: number;
  engineSize?: number;
  cylinders?: string;
  colors?: string;
  doors?: string;
  vin?: string;
  description?: string;
  videoLink?: string;

  galleryImages: {
    id: string;
    url: string;
  }[];

  attachments?: {
    id: string;
    fileUrl: string;
    originalName: string;
  }[];

  features?: {
    id: string;
    name: string;
  }[];

  safetyFeatures?: {
    id: string;
    name: string;
  }[];
}

export const fetchCarListings = async (
  page: number = 1,
  limit: number = 5
): Promise<{ data: CarListing[]; total: number }> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/car?page=${page}&limit=${limit}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    return {
      data: json.data || [],
      total: json.pagination?.totalItems ?? 0,
    };
  } catch (error) {
    console.error("Error fetching car listings:", error);
    return { data: [], total: 0 };
  }
};
