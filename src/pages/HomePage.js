import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSelectOrgan = (organ) => {
    navigate(`/report/${organ}`);
  };

  const organs = [
    "LIVER",
    "GALL BLADDER",
    "SPLEEN",
    "PANCREAS",
    "KIDNEY",
    "URINARY BLADDER",
    "UTERUS",
    "OVARY",
    "PROSTATE",
  ];

  const handleSelectRegion = (region) => {
    navigate(`/report/${region}`);
  };

  const regions = ["ABDOMEN", "PELVIS", "ABDOMEN AND PELVIS"];

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 mt-13">
        <br />
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Select Organ for Ultra Sonography Report
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {organs.map((organ) => (
            <div
              key={organ}
              className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{organ}</h2>
              {/* <p className="text-gray-600 mb-4">
                Click below to generate a report.
              </p> */}
              <button
                onClick={() => handleSelectOrgan(organ)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Click to generate report.
              </button>
            </div>
          ))}
        </div>
      </div>
      <br />
      <div className="container mx-auto px-4 mt-12 mb-10">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Select Region for Ultra Sonography Report
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region) => (
            <div
              key={region}
              className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{region}</h2>
              {/* <p className="text-gray-600 mb-4">
                Click below to generate a report.
              </p> */}
              <button
                onClick={() => handleSelectRegion(region)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Click to generate report.
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
