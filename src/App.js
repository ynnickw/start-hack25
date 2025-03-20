import React, { useState } from "react";
import syngentaLogo from "./assets/syngenta-logo.png";
import RecommendationForm from "./components/RecommendationForm";
import ResultPage from "./components/ResultPage";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ "cropType": "", "location": { "lat": -1, "lng": -1, "name": "Kolkata, India" }, "hasPlanted": true, "startTimestamp": "2025-03-20T14:46:52.479Z", "endTimestamp": "2025-07" });
  const [apiResults, setApiResults] = useState(null);

  const handleStart = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      // Mock response for testing
      const mockResponse = {
        location: {
          latitude: 27,
          longitude: 21
        },
        crop: "Wheat",
        stress_buster_recommended: true,
        yield_booster_recommended: true,
        risk_factors: {
          S_heat: {
            "2023-08": 0.390675969,
            "2023-09": 0.0914967637,
            "2023-10": 0.0,
            "2023-11": 0.0,
            "2023-12": 0.0
          },
          S_night: {
            "2023-08": 0.3694518093,
            "2023-09": 0.0,
            "2023-10": 0.0,
            "2023-11": 0.0,
            "2023-12": 0.0
          },
          S_frost: {
            "2023-08": 0.0,
            "2023-09": 0.0,
            "2023-10": 0.3005678268,
            "2023-11": 0.7757005477,
            "2023-12": 0.8780689239
          },
          drought_risk: 0.7,
          yield_risk: 0.5
        }
      };

      console.log("Mock API Response:", mockResponse);
      setApiResults(mockResponse);
      setShowResults(true);
      setShowForm(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-[100vh] bg-white p-4">
      <div className="flex justify-center items-start h-[10%]">
        <img
          src={syngentaLogo}
          alt="Syngenta Logo"
          className={`max-w-[200px] h-auto
                    ${!showForm && !showResults ? 'max-w-[500px] mt-60' : 'max-w-[200px]'}`}
        />
      </div>

      <div className="flex flex-col items-center justify-center h-[90%]">
        {!showForm && !showResults && (
          <>
            <h1 className="text-4xl font-semibold font-poppins text-center mb-12">
              Product Recommendation Agent for India
            </h1>
            <button
              className="px-10 py-3 text-lg text-white bg-[#003087] rounded-full cursor-pointer transition-colors duration-300 hover:bg-[#004abc] font-poppins"
              onClick={handleStart}
            >
              Start
            </button>
          </>
        )}

        {showForm && !showResults && (
          <RecommendationForm
            step={step}
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
            handleSubmit={handleSubmit}
          />
        )}

        {showResults && apiResults && <ResultPage apiResults={apiResults} formData={formData} />}
      </div>
    </div>
  );
}

export default App;