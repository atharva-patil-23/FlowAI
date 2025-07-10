import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io('http://localhost:5000');
    setSocket(socketConnection);

    socketConnection.on('taskUpdated', (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
    });

    return () => socketConnection.close();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    const task = {
      title: newTask,
      priority: 'medium',
      status: 'pending',
      createdAt: new Date()
    };

    // Add to local state immediately
    setTasks(prev => [...prev, { ...task, _id: Date.now() }]);
    setNewTask('');

    // TODO: Send to backend
  };

  const prioritizeWithAI = async () => {
    // TODO: Call AI service
    console.log('AI prioritization coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            IntelliTask
          </h1>
          <p className="text-gray-600">
            AI-Powered Task Management with Real-time Collaboration
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
            <button
              onClick={prioritizeWithAI}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🤖 AI Prioritize
            </button>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <TaskColumn 
            title="Pending" 
            tasks={tasks.filter(t => t.status === 'pending')}
            color="yellow"
          />
          
          {/* In Progress */}
          <TaskColumn 
            title="In Progress" 
            tasks={tasks.filter(t => t.status === 'progress')}
            color="blue"
          />
          
          {/* Completed */}
          <TaskColumn 
            title="Completed" 
            tasks={tasks.filter(t => t.status === 'completed')}
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, color }) => {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200'
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-lg p-4`}>
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
        {title}
        <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </h3>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task }) => {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50', 
    low: 'border-l-green-500 bg-green-50'
  };

  return (
    <div className={`bg-white border-l-4 ${priorityColors[task.priority]} p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
      <h4 className="font-medium text-gray-800 mb-1">{task.title}</h4>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="capitalize">{task.priority} priority</span>
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TaskDashboard;