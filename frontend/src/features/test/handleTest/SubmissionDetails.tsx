// src/pages/SubmissionDetails.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Submission } from '../../../types/studentAttempts.types';

interface LocationState {
  submission: Submission;
  studentAttemptId: string;
}

const SubmissionDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const submission = state?.submission;

  if (!submission) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No submission data available</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Helper function to determine status color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pass') || statusLower.includes('success') || statusLower === 'accepted') {
      return 'bg-green-50 text-green-700 border-green-200';
    } else if (statusLower.includes('fail') || statusLower.includes('wrong') || statusLower === 'rejected') {
      return 'bg-red-50 text-red-700 border-red-200';
    } else {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  // Calculate pass percentage
  const totalTests = parseInt(submission.total_test_cases) || 0;
  const passedTests = parseInt(submission.passed_test_cases) || 0;
  const passPercentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Submission Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#1DA077] text-white rounded-lg hover:bg-[#168a65]"
        >
          ← Back to Attempts
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Submission Metadata */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Submission Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Submission ID</p>
              <p className="font-medium text-sm">{submission.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student Attempt ID</p>
              <p className="font-medium text-sm">{submission.student_attempt_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Problem ID</p>
              <p className="font-medium text-sm">{submission.problem_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Language</p>
              <p className="font-medium">{submission.language}</p>
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-md text-xs border ${getStatusColor(submission.status)}`}>
                {submission.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Test Cases</p>
              <p className="font-medium">{submission.total_test_cases}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passed Test Cases</p>
              <p className="font-medium">{submission.passed_test_cases}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pass Percentage</p>
              <p className="font-medium">{passPercentage}%</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          {totalTests > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${passPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Execution Time</p>
              <p className="font-medium">{submission.execution_time} ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Memory Used</p>
              <p className="font-medium">{submission.memory_used} KB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submitted At</p>
              <p className="font-medium">
                {new Date(submission.submitted_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Source Code Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Source Code</h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">
              {submission.source_code || '// No code submitted'}
            </pre>
          </div>
        </div>

        {/* Test Cases Summary Card */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Test Cases Summary</h3>
              <p className="text-sm text-gray-600 mt-1">
                {passedTests} out of {totalTests} test cases passed
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Pass Rate</span>
              <p className="text-xl font-bold">{passPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;