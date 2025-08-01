"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { addTeamMember } from "@/utils/apiPost";
import { useRef } from "react";
import { toast } from "sonner";
import { FcRemoveImage } from "react-icons/fc";
import { useRouter } from "next/navigation";

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long"),
  role: z.string().min(1, "Role is required"),
});

export default function AddTeamForm() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasShownRef = useRef(false);
  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMember({ ...member, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const result = memberSchema.safeParse(member);

      if (!result.success) {
        const fieldErrors: { [key: string]: string } = {};
        result.error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      if (!image) {
        toast.error("Image is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", member.name);
      formData.append("email", member.email);
      formData.append("phone", member.phone);
      formData.append("role", member.role);
      formData.append("image", image);

      await toast.promise(addTeamMember(formData), {
        loading: "Adding team member...",
        success: (data) => data.message || "Team member added!",
        error: (err) =>
          err?.response?.data?.message || "Failed to add team member.",
      });
      setMember({ name: "", email: "", phone: "", role: "" });
      setImage(null);
      setPreviewUrl(null);
    }, 500);
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(member).every(
      (value) => value.trim() !== ""
    );
    setIsDisabled(!allFieldsFilled);
  }, [member]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      if (!token && !hasShownRef.current) {
        toast.error("You need to login first");
        router.push("/404Page");
        hasShownRef.current = true;
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verifytoken`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          throw new Error("Invalid token");
        }
      } catch (err) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        if (!hasShownRef.current) {
          toast.error("Session expired. Please login again.");
          router.push("/404Page");
          hasShownRef.current = true;
        }
      }
    };

    validateToken();
  }, []);

  if (!isLoggedIn) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Add Team</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto p-10 bg-gray-100 rounded-2xl"
      >
        <div>
          <input
            name="name"
            placeholder="Name"
            value={member.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded text-gray-800 focus:outline-none hover:border-orange-600 placeholder-gray-400"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            placeholder="Email"
            value={member.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded text-gray-800 focus:outline-none hover:border-orange-600 placeholder-gray-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            name="phone"
            placeholder="Phone Number"
            value={member.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded text-gray-800 focus:outline-none hover:border-orange-600 placeholder-gray-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div>
          <input
            name="role"
            placeholder="Role"
            value={member.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded text-gray-800 focus:outline-none hover:border-orange-600 placeholder-gray-400"
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        <div>
          <label className="block w-full p-2 border border-gray-400 rounded text-gray-400 hover:cursor-pointer hover:border-orange-600">
            {image ? image.name : "Choose file"}
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <div className="mt-2 flex items-center gap-4 relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 object-cover rounded border"
              />

              <button
                onClick={() => {
                  setImage(null);
                  setPreviewUrl(null);
                }}
                className="relative group p-2 rounded-full transition-transform duration-300 hover:cursor-pointer transform hover:-translate-y-1"
              >
                <FcRemoveImage className="size-8" />
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                  Remove selected image
                </span>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={` text-white px-4 py-2 rounded ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-600/75 hover:cursor-pointer"
          } `}
        >
          Add team member
        </button>
      </form>
    </div>
  );
}
