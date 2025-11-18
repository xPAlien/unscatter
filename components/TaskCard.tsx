import React from 'react';
import { Task, Effort, Impact } from '../types';

const effortColors: Record<Effort, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const impactColors: Record<Impact, string> = {
  low: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  high: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const Tag: React.FC<{ text: string; className: string }> = ({ text, className }) => (
  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${className}`}>
    {text}
  </span>
);

interface TaskCardProps {
  task: Task;
  isNextAction: boolean;
  index?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isNextAction, index }) => {
  const cardClasses = isNextAction
    ? 'bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-400 shadow-lg'
    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md';
  
  const animationStyle = !isNextAction && typeof index === 'number'
    ? {
        opacity: 0,
        animation: 'fadeInUp 0.4s ease-out forwards',
        animationDelay: `${index * 75}ms`,
      }
    : {};

  return (
    <div 
      className={`p-4 rounded-lg transition-shadow duration-200 ${cardClasses}`}
      style={animationStyle}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <p className={`text-base font-medium ${isNextAction ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {task.task}
        </p>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0 flex-shrink-0">
          <Tag text={`${task.impact} Impact`} className={impactColors[task.impact]} />
          <Tag text={`${task.effort} Effort`} className={effortColors[task.effort]} />
        </div>
      </div>
      {task.dependencies.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Depends on: </span>
          {task.dependencies.map((dep, index) => (
            <span key={dep} className="font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
              Task #{dep}{index < task.dependencies.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};