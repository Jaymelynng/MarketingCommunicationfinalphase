export type TaskChannel = 'Social' | 'Email' | 'In-Gym';

export interface TaskCounts {
  email: number;
  social: number;
  inGym: number;
}

export interface Task {
  task_id: string;
  task_title: string;
  templateId?: number;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
  };
  dependencies?: number[];
  timeTracking?: {
    estimated: number;
    actual: number;
  };
  description: string;
  due_date: string;
  go_live_date?: string;
  status: 'Scheduled' | 'FYI' | 'Heads-Up' | 'Attention Required' | 'Reminder' | 'Completed';
  priority: 'low' | 'medium' | 'high';
  channel: TaskChannel;
  checklistItems: ChecklistItem[];
  gym_id?: string;
  contentId?: string;
}

export interface TaskTemplate {
  id: number;
  name: string;
  description: string;
  defaultDuration?: number;
  checklistTemplate: string[];
  channel: TaskChannel;
}

export interface ChecklistItem {
  id: number;
  task: string;
  gyms: GymStatus[];
  dueDate?: string;
  assignedTo?: string;
}

export interface GymStatus {
  gymName: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  assignedTo?: string;
}