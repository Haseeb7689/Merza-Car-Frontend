"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaRegLightbulb, FaVideo, FaRegImages } from "react-icons/fa";
import { LiaPaperclipSolid } from "react-icons/lia";
import FeaturesSelector from "./selection/FeaturesSelector";
import SafetyFeatures from "./selection/SafetyFeatures";
import handleFileChange from "./utils/handleFileChange";
import rawCarData from "./data/carData.json";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingFormSchema } from "./schema/listingFormSchema";
import { z } from "zod";
import { addCarData } from "./../../utils/apiCarPost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ListingFormType = z.infer<typeof listingFormSchema>;

function AddCarsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    setValue,
    trigger,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ListingFormType>({
    resolver: zodResolver(listingFormSchema) as Resolver<ListingFormType>,
    defaultValues: {
      attachments: [],
      gallery: [],
      features: [],
      safetyFeatures: [],
    },
  });

  const featuresValue = watch("features");
  const safetyFeaturesValue = watch("safetyFeatures");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [galleryCount, setGalleryCount] = useState(0);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const carData = rawCarData as { [key: string]: string[] };
  const carMakes = Object.keys(carData);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value);
    setModel("");
  };

  const hasModels = make && carData[make]?.length > 0;
  const isModelDisabled = !make || !hasModels;

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e,
      galleryFiles,
      setGalleryFiles,
      setGalleryCount,
      50,
      "gallery",
      setValue,
      trigger
    );
  };
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e,
      attachmentFiles,
      setAttachmentFiles,
      setAttachmentCount,
      50,
      "attachments",
      setValue,
      trigger
    );
  };
  const debouncingSubmit = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: ListingFormType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("You need to Login/Register first");
      router.push("/Login");
      return;
    }
    toast.info("📝 Preparing your listing...", {
      duration: 1000,
      id: "upload",
    });
    if (debouncingSubmit.current) {
      clearTimeout(debouncingSubmit.current);
    }
    debouncingSubmit.current = setTimeout(async () => {
      setIsSubmitting(true);
      try {
        toast("📤 Uploading your car details...", {
          id: "upload",
        });

        const formData = new FormData();

        formData.append("title", data.listingTitle);
        formData.append("condition", data.condition.toUpperCase());
        formData.append("type", data.type || "");
        formData.append("make", data.make || "");
        formData.append("model", data.model || "");
        formData.append("price", data.price?.toString() || "");
        formData.append("year", data.year?.toString() || "");
        formData.append("driveType", data.driveType || "");
        formData.append("transmission", data.transmission || "");
        formData.append("fuelType", data.fuelType || "");
        formData.append("mileage", data.mileage?.toString() || "");
        formData.append("engineSize", data.engineSize?.toString() || "");
        formData.append("cylinders", data.cylinders || "");
        formData.append("color", data.colors || "");
        formData.append("doors", data.doors || "");
        formData.append("vin", data.vin || "");
        formData.append("description", data.description || "");

        if (data.videoLink) {
          formData.append("videoLink", data.videoLink);
        }
        data.gallery.forEach((file) => {
          formData.append("galleryImages", file);
        });
        data.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
        (data.features || []).forEach((feature) => {
          formData.append("features", feature);
        });

        (data.safetyFeatures || []).forEach((item) => {
          formData.append("safetyFeatures", item);
        });
        const res = await addCarData(formData);
        console.log(res);

        toast.success(
          `🚗 ${res.message || "Your car is now visible to potential buyers!"}`,
          {
            icon: "🎉",
            duration: 3000,
            id: "upload",
          }
        );

        reset();
        setModel("");
        setMake("");
        setValue("gallery", []);
        setValue("attachments", []);
        setGalleryFiles([]);
        setAttachmentFiles([]);
        setGalleryCount(0);
        setAttachmentCount(0);
      } catch (error: any) {
        toast.error(`❌ ${error.message || "Failed to submit listing."}`, {
          id: "upload",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="m-5 sm:m-10">
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-black text-4xl font-bold">Add Car</h2>
      </div>
      <div className="max-w-4xl mx-auto mt-3 bg-gray-100 rounded-xl shadow-lg overflow-hidden">
        {/* Form Header */}
        {!isLoggedIn && (
          <div className=" px-6 py-4">
            <div className="bg-blue-50 border text-center border-blue-200 text-blue-800 px-3 py-4 rounded-md">
              You must need to be{" "}
              <Link href="/Login">
                <strong className="hover:cursor-pointer underline">
                  Log in
                </strong>
              </Link>{" "}
              or{" "}
              <Link href="/Register">
                <strong className="hover:cursor-pointer underline">
                  Register
                </strong>
              </Link>{" "}
              first.
            </div>
          </div>
        )}
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-w-5xl mx-auto p-10 bg-gray-100"
        >
          <div>
            <label htmlFor="listingTitle" className="block text-gray-700 mb-2">
              Listing Title <strong className="text-red-600">*</strong>
            </label>
            <input
              {...register("listingTitle")}
              type="text"
              id="listingTitle"
              name="listingTitle"
              placeholder="Enter listing title"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.listingTitle && (
              <p className="text-red-500">{errors.listingTitle.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="condition" className="block text-gray-700 mb-2">
                Condition <strong className="text-red-600">*</strong>
              </label>
              <select
                {...register("condition")}
                id="condition"
                name="condition"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="certified">Certified Pre-Owned</option>
              </select>
              {errors.condition && (
                <p className="text-red-500">{errors.condition.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="type" className="block text-gray-700 mb-2">
                Type
              </label>
              <select
                {...register("type")}
                id="type"
                name="type"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="pickup">Pickup Truck</option>
                <option value="minivan">Minivan</option>
              </select>
              {errors.type && (
                <p className="text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="make" className="block text-gray-700 mb-2">
                Make
              </label>
              <select
                {...register("make")}
                id="make"
                name="make"
                value={make}
                onChange={handleMakeChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {" "}
                <option value="">Select Make</option>
                {carMakes.map((makeKey) => (
                  <option key={makeKey} value={makeKey}>
                    {makeKey.charAt(0).toUpperCase() + makeKey.slice(1)}
                  </option>
                ))}
              </select>
              {errors.make && (
                <p className="text-red-500">{errors.make.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="model" className="block text-gray-700 mb-2">
                Model
              </label>
              <select
                {...register("model")}
                id="model"
                name="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={isModelDisabled}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                        ${
                          isModelDisabled
                            ? "bg-gray-100 cursor-not-allowed text-gray-500"
                            : "bg-white text-black"
                        }
                  `}
              >
                {!make && <option value="">Select Make First</option>}

                {make && hasModels ? (
                  <>
                    <option value="">Select Model</option>
                    {carData[make].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </>
                ) : (
                  make && <option value="">No models available</option>
                )}
              </select>
              {errors.model && (
                <p className="text-red-500">{errors.model.message}</p>
              )}
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
                  {...register("price", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  type="number"
                  id="price"
                  name="price"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="year" className="block text-gray-700 mb-2">
                Year
              </label>
              <input
                {...register("year", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                type="number"
                id="year"
                name="year"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.year && (
                <p className="text-red-500">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="driveType" className="block text-gray-700 mb-2">
                Drive Type
              </label>
              <select
                {...register("driveType")}
                name="driveType"
                id="driveType"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="awd">AWD/4WD</option>
                <option value="fwd">Front Wheel Drive</option>
                <option value="rwd">Rear Wheel Drive</option>
              </select>
              {errors.driveType && (
                <p className="text-red-500">{errors.driveType.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="transmission"
                className="block text-gray-700 mb-2"
              >
                Transmission
              </label>
              <select
                {...register("transmission")}
                name="transmission"
                id="transmission"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="semiAutomatic">Semi-Automatic</option>
              </select>
              {errors.transmission && (
                <p className="text-red-500">{errors.transmission.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="fuelType" className="block text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                {...register("fuelType")}
                name="fuelType"
                id="fuelType"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="petrol">Petrol</option>
              </select>
              {errors.fuelType && (
                <p className="text-red-500">{errors.fuelType.message}</p>
              )}
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
                  {...register("mileage", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  type="number"
                  id="mileage"
                  name="mileage"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              {errors.mileage && (
                <p className="text-red-500">{errors.mileage.message}</p>
              )}
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
                  {...register("engineSize", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  type="number"
                  id="engineSize"
                  name="engineSize"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              {errors.engineSize && (
                <p className="text-red-500">{errors.engineSize.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="cylinders" className="block text-gray-700 mb-2">
                Cylinders
              </label>
              <select
                {...register("cylinders")}
                name="cylinders"
                id="cylinders"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </select>
              {errors.cylinders && (
                <p className="text-red-500">{errors.cylinders.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="colors" className="block text-gray-700 mb-2">
                Colors
              </label>
              <select
                {...register("colors")}
                name="colors"
                id="colors"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="black">Black</option>
                <option value="blue">Blue</option>
                <option value="brown">Brown</option>
                <option value="gold">Gold</option>
                <option value="green">Green</option>
                <option value="gray">Gray</option>
                <option value="orange">Orange</option>
                <option value="pearlwhite">Pearl White</option>
                <option value="red">Red</option>
                <option value="silver">Silver</option>
                <option value="white">White</option>
                <option value="yellow">Yellow</option>
              </select>
              {errors.colors && (
                <p className="text-red-500">{errors.colors.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="doors" className="block text-gray-700 mb-2">
                Doors
              </label>
              <select
                {...register("doors")}
                name="doors"
                id="doors"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="2">2-doors</option>
                <option value="3">3-doors</option>
                <option value="4">4-doors</option>
                <option value="5">5-doors</option>
              </select>
              {errors.doors && (
                <p className="text-red-500">{errors.doors.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="vin" className="block text-gray-700 mb-2">
                VIN
              </label>
              <input
                {...register("vin")}
                type="text"
                id="vin"
                name="vin"
                placeholder="Vehicle Identification Number"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.vin && (
                <p className="text-red-500">{errors.vin.message}</p>
              )}
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              name="description"
              rows={5}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
              placeholder="Describe your vehicle in detail..."
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="mt-5">
            <label
              htmlFor="videoLink"
              className="block text-[10px] md:text-sm font-medium text-gray-700 mb-2"
            >
              Video - copy any online video link e.g. YouTube, Facebook,
              Instagram or .mp4
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaVideo size={20} className="text-orange-600" />
              </span>
              <input
                {...register("videoLink", {
                  setValueAs: (v) => (v === "" ? undefined : String(v)),
                })}
                id="videoLink"
                name="videoLink"
                type="url"
                className="w-full pl-11 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                placeholder="Video Link"
              />
            </div>
            {errors.videoLink && (
              <p className="text-red-500">{errors.videoLink.message}</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-20 mt-5">
              <label
                htmlFor="gallery"
                className="block text-2xl md:text-4xl font-bold text-gray-700 mb-2"
              >
                Gallery
              </label>
              <div className="hidden md:flex bg-blue-50 border-1 border-blue-500 rounded-sm gap-5 mb-4">
                <div className="flex gap-3 items-center text-orange-600  border-r-1 border-blue-500 p-4 ">
                  <FaRegLightbulb size={35} />
                  Quick tips
                </div>
                <div className="p-3">
                  <p className="text-[12px] font-semibold">
                    Attractive photos increase the popularity of the
                    advertisement up to 5 times!
                  </p>
                  <p className="text-[12px] text-orange-600 underline font-semibold cursor-pointer">
                    How do you take good pictures?
                  </p>
                </div>
              </div>
            </div>
            <label
              htmlFor="gallery"
              className="relative w-full h-28 md:h-48 flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-md cursor-pointer hover:text-orange-600 transition"
            >
              <div className="flex items-center gap-5">
                <FaRegImages className="mb-2 md:size-[50px]" size={35} />
                <span className="font-medium text-xl">Add Images</span>
              </div>

              <input
                {...register("gallery", {
                  setValueAs: (files: FileList | null) =>
                    files ? Array.from(files) : [],
                })}
                id="gallery"
                name="gallery"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryChange}
              />

              {galleryCount > 0 && (
                <span className="absolute bottom-2 left-3 text-sm text-gray-600 font-semibold">
                  {galleryCount}/50
                </span>
              )}
            </label>
            {errors.gallery && (
              <p className="text-red-500 text-sm">{errors.gallery.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-20 mt-5">
              <label
                htmlFor="attachments"
                className="block text-2xl md:text-4xl font-bold text-gray-700 mb-2"
              >
                Attachments
              </label>
            </div>
            <label
              htmlFor="attachments"
              className="relative w-full h-28 md:h-48 flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-md cursor-pointer hover:text-orange-600 transition"
            >
              <div className="flex items-center gap-3">
                <LiaPaperclipSolid className="mb-2 md:size-[50px]" size={40} />
                <span className="font-medium text-lg md:text-xl">
                  Add Attachments
                </span>
              </div>
              <input
                {...register("attachments", {
                  setValueAs: (files: FileList | null) =>
                    files ? Array.from(files) : [],
                })}
                id="attachments"
                name="attachments"
                type="file"
                multiple
                className="hidden"
                onChange={handleAttachmentChange}
              />
              {attachmentCount > 0 && (
                <span className="absolute bottom-2 left-3 text-sm text-gray-600 font-semibold">
                  {attachmentCount}/50
                </span>
              )}
            </label>
            {errors.attachments && (
              <p className="text-red-500 text-sm">
                {errors.attachments.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-20 mt-10">
              <label
                htmlFor="features"
                className="block text-2xl md:text-4xl font-bold text-gray-700"
              >
                Features
              </label>
            </div>
            <FeaturesSelector
              value={featuresValue}
              onChange={(features) =>
                setValue("features", features, { shouldValidate: true })
              }
            />
            {errors.features && (
              <p className="text-red-500 text-sm mt-1">
                {errors.features.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-20 mt-10">
              <label
                htmlFor="safetyFeature"
                className="block text-4xl font-bold text-gray-700"
              >
                Safety Features
              </label>
            </div>
            <SafetyFeatures
              value={safetyFeaturesValue}
              onChange={(safetyFeatures) =>
                setValue("safetyFeatures", safetyFeatures, {
                  shouldValidate: true,
                })
              }
            />
            {errors.safetyFeatures && (
              <p className="text-red-500 text-sm mt-1">
                {errors.safetyFeatures.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <button
              disabled={isSubmitting}
              className={`w-40 h-13 text-lg font-bold text-white rounded-md transition
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-orange-600 hover:bg-orange-500 cursor-pointer"
    }`}
            >
              {isSubmitting ? "Submitting..." : "Add Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCarsForm;
