import React, { useState } from "react";
import syngentaLogo from "./assets/syngenta-logo.png";
import RecommendationForm from "./components/RecommendationForm";
import ResultPage from "./components/ResultPage";
import api from './api/axios';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ "cropType": "", "location": { "lat": -1, "lng": -1, "name": "Kolkata, India" }, "hasPlanted": true, "startTimestamp": "2025-03-20T14:46:52.479Z", "endTimestamp": "2025-07" });
  const [apiResults, setApiResults] = useState(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleStart = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      // Parse startTimestamp and endTimestamp to extract the year
      const startDate = new Date(formData.startTimestamp);
      const startYear = startDate.getFullYear() - 1;
      const formattedStartDate = `${startYear}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;

      const endYear = parseInt(formData.endTimestamp.split("-")[0], 10) - 1;
      const formattedEndDate = `${endYear}-${formData.endTimestamp.split("-")[1]}-27`;

      const requestBody = {
        latitude: formData.location.lat,
        longitude: formData.location.lng,
        crop_type: formData.cropType,
        planting_date: formattedStartDate,
        harvest_date: formattedEndDate,
        location: formData.location.name,
      };

      // Use the api instance with AWS auth
      const response = await api.post('default/calculate-risk', requestBody);
      
      console.log("API Response:", response.data);
      setApiResults(response.data);
      setShowResults(true);
      setShowForm(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.trim() === "") return;
    setShowPhonePopup(false);
    setShowForm(false);
    setShowResults(false);
    setShowThankYou(true);
  };

  return (
    <div className="flex flex-col h-[100vh] bg-white p-4">
      <div className={"flex flex-row items-start h-[10%]" + ((!showResults) ? ' justify-center' : ' justify-between')}>
        <img
          src={syngentaLogo}
          alt="Syngenta Logo"
          className={`max-w-[200px] h-auto
                    ${!showForm && !showResults ? 'max-w-[500px] mt-60' : 'max-w-[200px]'}`}
        />
        {!showThankYou && <button
            className={"bg-[#003087] text-white mr-10 mt-4 px-10 py-2 rounded-full hover:bg-[#004abc] transition duration-300" + (!showResults ? ' hidden' : '')}
            onClick={() => setShowPhonePopup(true)}
          >
            Stay in Touch
          </button>}
      </div>

      <div className="flex flex-col items-center justify-center h-[90%]">
        {!showForm && !showResults && !showThankYou && (
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
        {showThankYou && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">Thank you!</h2>
            <p className="text-lg">We have received your phone number. We'll get in touch soon.</p>
          </div>
        )}
      </div>

      {showPhonePopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">Enter your phone number</h2>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowPhonePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#003087] text-white px-4 py-2 rounded hover:bg-[#004abc]"
                onClick={handlePhoneSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;