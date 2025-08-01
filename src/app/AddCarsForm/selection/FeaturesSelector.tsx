import React, { useState, useEffect } from "react";
import features from "./../data/featureList.json";

export default function FeaturesSelector({
  onChange,
  value = [],
}: {
  onChange: (features: string[]) => void;
  value?: string[];
}) {
  const featuresList = features as string[];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (feature: string) => {
    let updated: string[];
    if (selectedFeatures.includes(feature)) {
      updated = selectedFeatures.filter((f) => f !== feature);
    } else {
      updated = [...selectedFeatures, feature];
    }
    setSelectedFeatures(updated);
    onChange(updated);
  };

  useEffect(() => {
    setSelectedFeatures(value || []);
  }, [value]);

  return (
    <div className="mt-5">
      <label className="block text-2xl font-bold text-gray-700 mb-4"></label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {featuresList.map((feature) => {
          const selected = selectedFeatures.includes(feature);
          return (
            <button
              key={feature}
              type="button"
              className={`text-center border rounded-md px-4 py-2 transition hover:bg-orange-50 hover:border-orange-500 ${
                selected
                  ? "bg-orange-50 text-orange-500 border-orange-500"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:shadow-md`}
              onClick={() => toggleFeature(feature)}
            >
              {feature}
            </button>
          );
        })}
      </div>
    </div>
  );
}
