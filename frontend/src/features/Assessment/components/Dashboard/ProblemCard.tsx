import React from 'react';
import StatusBadge from '../Shared/StatusBadge';
import { useAssessment, type ProblemStatus } from '../../context/AssessmentContext';

interface ProblemCardProps {
  id: string;
  problemId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: ProblemStatus;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ 
  id, 
  problemId, 
  title, 
  difficulty, 
  status
}) => {
  const { setCurrentAssignedProblemId, toggleView, loadProblemDetails, saveDraft, currentAssignedProblemId, currentCode, currentLanguage } = useAssessment();

  const handleAction = async () => {
    setCurrentAssignedProblemId(id);
    await loadProblemDetails(problemId, id);
    await saveDraft(currentAssignedProblemId!, {
      last_language: currentLanguage,
      last_saved_code: currentCode
    })
    toggleView();
  };

  const getActionButton = () => {
    
    const buttonText = status === 'Attempted' ? 'Resume Code' : 'Start Solving';
    const buttonClass = status === 'Attempted' 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'bg-green-600 hover:bg-green-700';
    
    return (
      <button 
        onClick={handleAction}
        className={`px-4 py-2 ${buttonClass} text-white rounded-lg transition-colors text-sm font-medium`}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-lg truncate pr-4" title={title}>
          {title}
        </h3>
        <StatusBadge type="difficulty" value={difficulty} />
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <StatusBadge type="status" value={status} />
        <div className="flex items-center space-x-2">
          {getActionButton()}
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;