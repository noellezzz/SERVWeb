import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TestHeatMap from './test-heatmap';
import TestSectorMap from './test-sectormap';
import TestDataLayer from './test-datalayer';
import TestGeocode from './test-geocode';

const TestsPage = () => {
  const [activeTest, setActiveTest] = useState(null);
  
  // Add your test components to this array
  const testComponents = [
    {
      name: "Senior Citizen Heatmap",
      component: <TestHeatMap />
    },
    {
      name: "Philippines Region Map",
      component: <TestSectorMap />
    },
    {
      name: "Regional Data Layer Map",
      component: <TestDataLayer />
    },
    {
      name: "Geocoding Utility",
      component: <TestGeocode />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Component Testing Area</h1>
          <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Home
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex">
            {/* Sidebar with test component list */}
            <div className="w-64 border-r border-gray-200 h-[calc(100vh-150px)] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-lg">Test Components</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {testComponents.length === 0 ? (
                  <li className="p-4 text-gray-500 italic">
                    No test components added yet
                  </li>
                ) : (
                  testComponents.map((test, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setActiveTest(index)}
                        className={`w-full text-left p-4 hover:bg-gray-50 ${
                          activeTest === index ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        {test.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Component display area */}
            <div className="flex-1 p-6 h-[calc(100vh-150px)] overflow-y-auto">
              {activeTest !== null ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">{testComponents[activeTest].name}</h2>
                  {testComponents[activeTest].component}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <p className="text-xl mb-4">Select a test component from the sidebar</p>
                  <p>
                    To add new test components, import them at the top of this file and add them to the testComponents array.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
