import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAuth } from '../../context/AuthContext';
import { AddTaskModal } from './AddTaskModal';

export function TaskList() {
  const { tasks, deleteTask } = useTaskStore();
  const { isAdmin, user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter tasks for gym managers
  const filteredTasks = user?.role === 'manager'
    ? tasks.filter(task => 
        task.checklistItems.some(item => 
          item.gyms.some(gym => gym.gymName === user.gymId)
        )
      )
    : tasks;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        {isAdmin() && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ background: "#b48f8f" }}
          >
            <Plus size={16} />
            Add New Task
          </button>
        )}
        <h2 className="text-xl font-medium"
          style={{ borderColor: "#cec4c1" }}
        >
          {user?.role === 'manager' ? 'Your Tasks' : 'All Tasks'}
        </h2>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-white rounded-lg border hover:shadow-md transition-all p-4"
            style={{ borderColor: "#cec4c1" }}
          >
            <Link to={`/tasks/${task.id}`} className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-[#8b8585] mb-1">{task.title}</h3>
                  <div className="flex gap-4">
                    <p className="text-sm text-[#737373] flex items-center gap-1">
                      <Clock size={14} className="text-yellow-500" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    {task.goLiveDate && (
                      <p className="text-sm text-[#737373] flex items-center gap-1">
                        <Calendar size={14} className="text-green-500" />
                        Goes Live: {new Date(task.goLiveDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-[#737373]">
                    {TASK_CHANNEL_LABELS[task.channel]}
                  </span>
                  {isAdmin() && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteTask(task.id);
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}