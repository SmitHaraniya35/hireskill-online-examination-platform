import React from "react";

const CompletionPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg border border-gray-200 p-12 max-w-md w-full text-center space-y-6 shadow-lg">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200">
          <span className="text-4xl text-green-600">✓</span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Test Completed!</h1>
          <p className="text-lg text-gray-700">
            Thank you for giving the test
          </p>
          <p className="text-gray-600">
            Your responses have been submitted successfully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
