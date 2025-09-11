import React from 'react';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

interface TaskConfirmationProps {
  task: {
    type: string;
    plantName: string;
    time: string;
    frequency: string;
    imageUrl: string;
  };
  onOk: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskConfirmation: React.FC<TaskConfirmationProps> = ({
  task,
  onOk,
  onEdit,
  onDelete
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center gap-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-green-800">Task Created</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-6">
        {/* Task Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            {/* Plant Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={task.imageUrl} 
                alt={task.plantName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Task Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {task.plantName} - {task.type}
              </h3>
              <p className="text-sm text-gray-600">
                {task.time} - {task.frequency}
              </p>
            </div>

            {/* Action Icons */}
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 rounded-full hover:bg-green-50 transition-colors"
              >
                <Edit className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Task created successfully!
          </h2>
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-5 space-y-3">
        <Button
          onClick={onOk}
          variant="primary"
          className="w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700"
        >
          Ok
        </Button>
        <Button
          onClick={onEdit}
          variant="outline"
          className="w-full py-4 text-lg font-semibold border-green-600 text-green-600 hover:bg-green-50"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default TaskConfirmation;

