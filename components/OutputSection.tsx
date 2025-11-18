
import React from 'react';
import { AnalysisResult, Task } from '../types';
import { TaskCard } from './TaskCard';

interface OutputSectionProps {
  result: AnalysisResult;
}

export const OutputSection: React.FC<OutputSectionProps> = ({ result }) => {
  const { tasks, nextActionId } = result;

  const tasksByCluster = tasks.reduce((acc, task) => {
    const cluster = task.cluster;
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const nextActionTask = tasks.find(task => task.id === nextActionId);

  return (
    <div className="space-y-10">
      {nextActionTask && (
        <div>
          <h2 className="text-sm font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-3">Next Actionable Step</h2>
          <TaskCard task={nextActionTask} isNextAction={true} />
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Full Plan</h2>
        <div className="space-y-6">
          {Object.entries(tasksByCluster).map(([cluster, clusterTasks]) => (
            <div key={cluster}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{cluster}</h3>
              <div className="space-y-3">
                {clusterTasks
                  .filter(task => task.id !== nextActionId)
                  .map((task, index) => (
                    <TaskCard key={task.id} task={task} isNextAction={false} index={index} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
