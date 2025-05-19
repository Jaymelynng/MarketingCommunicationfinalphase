import React from 'react';
import { PageHeader } from '../components/Layout/PageHeader';
import { TaskList } from '../components/Tasks/TaskList';

export function Tasks() {
  return (
    <>
      <PageHeader 
        title="Task Management"
        description="Track and manage tasks across all gymnastics facilities"
      />
      <TaskList />
    </>
  );
}