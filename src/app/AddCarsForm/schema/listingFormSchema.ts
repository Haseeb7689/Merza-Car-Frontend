import { z } from "zod";

export const listingFormSchema = z.object({
  listingTitle: z.string().min(1, "Listing title is required"),
  condition: z.enum(["new", "used", "certified"], {
    errorMap: () => ({ message: "Please select a valid condition" }),
  }),
  type: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than zero")
    .optional(),
  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  driveType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  mileage: z
    .number({ invalid_type_error: "Mileage must be a number" })
    .nonnegative()
    .optional(),
  engineSize: z
    .number({ invalid_type_error: "Engine size must be a number" })
    .positive("Price must be greater than zero")
    .optional(),
  cylinders: z.string().optional(),
  colors: z.string().optional(),
  doors: z.string().optional(),
  vin: z.string().optional(),
  description: z.string().optional(),
  videoLink: z.string().url("Invalid URL").optional(),
  gallery: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one image")
    .max(50, "You can upload up to 50 images")
    .refine(
      (files) => files.every((file) => file.type.startsWith("image/")),
      "Only image files are allowed in the gallery"
    )
    .default([]),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file")
    .max(50, "You can upload up to 50 files")
    .refine(
      (files) => files.every((file) => !file.type.startsWith("image/")),
      "Image files are not allowed in attachments"
    )
    .default([]),

  features: z.array(z.string()).optional().default([]),
  safetyFeatures: z.array(z.string()).optional().default([]),
});

export type FormType = z.infer<typeof listingFormSchema>;
