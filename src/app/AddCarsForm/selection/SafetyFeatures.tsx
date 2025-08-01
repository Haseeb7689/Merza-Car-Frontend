import React, { useState, useEffect } from "react";
import safetyFeatures from "./../data/safetyFeatureList.json";

export default function SafetyFeatures({
  onChange,
  value = [],
}: {
  onChange: (safetyFeatures: string[]) => void;
  value?: string[];
}) {
  const safetyFeaturesList = safetyFeatures as string[];

  const [selectedSafetyFeatures, setSelectedSafetyFeatures] = useState<
    string[]
  >([]);

  const toggleFeature = (safetyFeature: string) => {
    let updated: string[];
    if (selectedSafetyFeatures.includes(safetyFeature)) {
      updated = selectedSafetyFeatures.filter((f) => f !== safetyFeature);
    } else {
      updated = [...selectedSafetyFeatures, safetyFeature];
    }
    setSelectedSafetyFeatures(updated);
    onChange(updated);
  };
  useEffect(() => {
    setSelectedSafetyFeatures(value || []);
  }, [value]);

  return (
    <div className="mt-5">
      <label className="block text-2xl font-bold text-gray-700 mb-4"></label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {safetyFeaturesList.map((safetyFeature) => {
          const selected = selectedSafetyFeatures.includes(safetyFeature);
          return (
            <button
              key={safetyFeature}
              type="button"
              className={`text-center border rounded-md px-4 py-2 transition hover:bg-orange-50 hover:border-orange-500 ${
                selected
                  ? "bg-orange-50 text-orange-500 border-orange-500"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:shadow-md`}
              onClick={() => toggleFeature(safetyFeature)}
            >
              {safetyFeature}
            </button>
          );
        })}
      </div>
    </div>
  );
}
