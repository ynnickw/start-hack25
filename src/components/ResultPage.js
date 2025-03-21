import React from "react";
import Chatbot from "./Chatbot";
import Dashboard from "./Dashboard";

function ResultPage({ apiResults, formData }) {
  return (
    <div className="flex h-[90vh] w-full justify-center items-center gap-4 p-4">
      {/* Left Card: Chat Component (40%) */}
      <div className="w-2/5 bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
        <h2 className="text-3xl font-semibold mb-4">Personal Assistant</h2>
        <div className="flex-grow h-full">
          <Chatbot apiResults={apiResults} formData={formData} />
        </div>
      </div>

      {/* Right Card: Dashboard Component (60%) */}
      <div className="w-3/5 bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
        <h2 className="text-3xl font-semibold mb-4">Risk Analysis Results</h2>
        <Dashboard apiResults={apiResults} formData={formData} />
      </div>
    </div>
  );
}

export default ResultPage;
