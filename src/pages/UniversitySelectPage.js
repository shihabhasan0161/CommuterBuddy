import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UniversitySelectPage() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const navigate = useNavigate();

  const universities = ['UofT', 'York'];

  const handleNext = () => {
    if (selectedUniversity) {
      navigate('/transit', { state: { university: selectedUniversity } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Commuter Buddy</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Select Your University
            </h2>
          
          <div className="space-y-4 mb-8">
            {universities.map((university) => (
              <label
                key={university}
                className="flex items-center p-4 border border-white/30 rounded-lg cursor-pointer hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <input
                  type="radio"
                  name="university"
                  value={university}
                  checked={selectedUniversity === university}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-4 h-4 text-blue-600 mr-3"
                />
                <span className="text-lg font-medium text-gray-700">
                  {university}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedUniversity}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedUniversity
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default UniversitySelectPage;
