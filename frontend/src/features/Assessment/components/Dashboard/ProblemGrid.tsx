import React from 'react';
import ProblemCard from './ProblemCard';
import { useAssessment, type ProblemStatus } from '../../context/AssessmentContext';

const ProblemGrid: React.FC = () => {
  const { assignedProblems, loading } = useAssessment();

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    easy: assignedProblems.filter(p => p.difficulty === 'Easy').length,
    medium: assignedProblems.filter(p => p.difficulty === 'Medium').length,
    hard: assignedProblems.filter(p => p.difficulty === 'Hard').length,
    submitted: assignedProblems.filter(p => p.status === 'Submitted').length,
    attempted: assignedProblems.filter(p => p.status === 'Attempted').length,
    notAttempted: assignedProblems.filter(p => p.status === 'Not Attempted').length,
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Student Test Dashboard</h2>
        <p className="text-gray-600 mt-2">Select a problem to start coding</p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <p className="text-sm text-blue-500">Total</p>
            <p className="text-2xl font-bold text-blue-800">{assignedProblems.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <p className="text-sm text-green-600">Submitted</p>
            <p className="text-2xl font-bold text-green-700">{stats.submitted}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <p className="text-sm text-yellow-600">Attempted</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.attempted}</p>
          </div>
          <div className="bg-gray-190 rounded-lg border border-gray-300 p-4">
            <p className="text-sm text-gray-600">Not Started</p>
            <p className="text-2xl font-bold text-gray-700">{stats.notAttempted}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignedProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            id={problem.id}
            problemId={problem.problem_id}
            title={problem.title}
            difficulty={problem.difficulty as 'Easy' | 'Medium' | 'Hard'}
            status={problem.status as ProblemStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ProblemGrid;