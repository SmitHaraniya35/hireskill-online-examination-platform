import React from 'react';
import type { ProblemStatus } from '../../context/AssessmentContext';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface StatusBadgeProps {
  type: 'difficulty' | 'status';
  value: Difficulty | ProblemStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getDifficultyStyles = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Hard':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusStyles = (status: ProblemStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Attempted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Not Attempted':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const styles = type === 'difficulty' 
    ? getDifficultyStyles(value as Difficulty)
    : getStatusStyles(value as ProblemStatus);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles}`}>
      {value}
    </span>
  );
};

export default StatusBadge;