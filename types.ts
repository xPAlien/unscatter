
export type Effort = 'low' | 'medium' | 'high';
export type Impact = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  task: string;
  cluster: string;
  effort: Effort;
  impact: Impact;
  dependencies: number[];
}

export interface AnalysisResult {
  tasks: Task[];
  nextActionId: number;
}
