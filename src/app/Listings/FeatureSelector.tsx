// components/FeatureSelector.tsx
import { useState } from "react";
import featuresList from "./../AddCarsForm/data/featureList.json"; // or adjust path

export default function FeatureSelector({
  selectedFeatures,
  setSelectedFeatures,
}: {
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
}) {
  const [showModal, setShowModal] = useState(false);

  const toggleFeature = (feature: string) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];

    setSelectedFeatures(updated);
  };
  const clearAll = () => {
    setSelectedFeatures([]);
  };

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">Features</label>
      <div
        onClick={() => setShowModal(true)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer"
      >
        {selectedFeatures.length > 0
          ? selectedFeatures.join(", ")
          : "Select Features"}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-200/30">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg pointer-events-auto">
            <h2 className="text-xl font-semibold mb-4">Select Features</h2>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {featuresList.map((feature) => (
                <label key={feature} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-between gap-2">
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:underline cursor-pointer"
              >
                Clear All "Features"
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
