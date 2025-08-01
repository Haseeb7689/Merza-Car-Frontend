"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = typeof window !== "undefined" ? useRouter() : null;

  return (
    <div className="min-h-150 flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        The page you’re looking for doesn’t exist or might have been moved.
      </p>
      <a
        href="/"
        className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-md transition"
      >
        🏠 Go to Homepage
      </a>
    </div>
  );
}
