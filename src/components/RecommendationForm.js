import React, { useState, useEffect } from 'react';
import { searchLocation } from '../services/geocodingService';

const RecommendationForm = ({ step, formData, setFormData, setStep, handleSubmit }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasPlantedQuestion, setHasPlantedQuestion] = useState(false);

    useEffect(() => {
        if (!isTyping) return;

        const searchTimeout = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                const results = await searchLocation(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
            setIsTyping(false);
        }, 1000);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery, isTyping]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setIsTyping(true);
    };

    const handleLocationSelect = (location) => {
        setFormData({
            ...formData,
            location: {
                lat: location.lat,
                lng: location.lng,
                name: location.formatted
            }
        });
        setSearchQuery(location.formatted);
        setIsTyping(false);
        setSearchResults([]);
    };

    const handleDateChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const renderFormStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="flex flex-col items-center space-y-4">
                        <h2 className="text-xl font-semibold font-poppins mb-4">Select Crop Type</h2>
                        <div className="space-y-2">
                            {['Cotton', 'Rice', 'Wheat'].map((crop) => (
                                <button
                                    key={crop}
                                    className={`w-full px-6 py-3 rounded-lg font-poppins transition-colors duration-300
                    ${formData.cropType === crop ? 'bg-[#003087] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                                    onClick={() => {
                                        setFormData({ ...formData, cropType: crop });
                                        setStep(1);
                                    }}
                                >
                                    {crop}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="flex flex-col items-center space-y-4">
                        <h2 className="text-xl font-semibold font-poppins mb-4">Where in India are you growing? 📍</h2>
                        <div className="w-full relative">
                            <input
                                type="text"
                                placeholder="Search for a location..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 font-poppins focus:outline-none focus:ring-2 focus:ring-[#003087]"
                                value={searchQuery}
                                onChange={handleInputChange}
                            />

                            {isSearching && (
                                <div className="absolute right-3 top-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#003087]"></div>
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={index}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 font-poppins text-sm"
                                            onClick={() => handleLocationSelect(result)}
                                        >
                                            {result.formatted}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className={`px-8 py-2 rounded-full font-poppins transition-colors duration-300 ${searchQuery
                                    ? 'bg-[#003087] text-white hover:bg-[#004abc]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            onClick={() => setStep(2)}
                            disabled={!searchQuery}
                        >
                            Next
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-semibold font-poppins my-4">Have you already planted your {formData.cropType}? 🌱</h1>
                        {!hasPlantedQuestion && <div className="flex space-x-4">
                            <button
                                className={`px-6 py-2 rounded-lg font-poppins ${formData.hasPlanted ? 'bg-[#003087] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                onClick={() => {
                                    setFormData({ ...formData, hasPlanted: true, startTimestamp: new Date().toISOString() })
                                    setHasPlantedQuestion(true)
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className={`px-6 py-2 rounded-lg font-poppins ${formData.hasPlanted === false ? 'bg-[#003087] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                onClick={() => {
                                    setFormData({ ...formData, hasPlanted: false })
                                    setHasPlantedQuestion(true)
                                }}
                            >
                                No
                            </button>
                        </div>}
                        {hasPlantedQuestion && <>
                            {!formData.hasPlanted && (
                                <>
                                    <label className="text-sm font-poppins mb-2">When will you plant?</label>
                                    <input
                                        type="month"
                                        className="px-4 py-2 rounded-lg border border-gray-300 font-poppins"
                                        onChange={(e) => handleDateChange(e, 'startTimestamp')}
                                        lang="en"
                                    />
                                </>
                            )}
                            <label className="text-sm font-poppins mb-2">When will you harvest?</label>
                            <input
                                type="month"
                                className="px-4 py-2 rounded-lg border border-gray-300 font-poppins"
                                onChange={(e) => handleDateChange(e, 'endTimestamp')}
                                lang="en"
                            />
                            <button
                                className={`px-8 py-2 rounded-full font-poppins transition-colors duration-300 mt-10 ${(formData.hasPlanted || formData.startTimestamp) && formData.endTimestamp
                                        ? 'bg-[#003087] text-white hover:bg-[#004abc]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                onClick={handleSubmit}
                                disabled={!(formData.hasPlanted || formData.startTimestamp) || !formData.endTimestamp}
                            >
                                Start Recommendation
                            </button>
                        </>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 transition-all duration-700 ease-in-out transform opacity-100 translate-y-0">
            {renderFormStep()}
        </div>
    );
};

export default RecommendationForm;