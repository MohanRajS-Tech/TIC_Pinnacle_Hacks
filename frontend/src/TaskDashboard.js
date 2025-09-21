import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  "Unassigned": "bg-gray-200 text-gray-800",
  "Assigned": "bg-blue-200 text-blue-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  "Completed": "bg-green-200 text-green-800",
};

const TaskDashboard = ({ tasks, setTasks, eventTitle }) => {
  const navigate = useNavigate();
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, cellName }
  const [editedValue, setEditedValue] = useState('');

  const handleCellClick = (rowIndex, cellName, currentValue) => {
    setEditingCell({ rowIndex, cellName });
    setEditedValue(currentValue);
  };

  const handleUpdateCell = () => {
    if (!editingCell) return;

    const { rowIndex, cellName } = editingCell;
    const updatedTasks = [...tasks];
    const taskToUpdate = { ...updatedTasks[rowIndex] };

    // Convert to number for time and cost
    const isNumericField = cellName === 'timeTaken' || cellName === 'cost';
    taskToUpdate[cellName] = isNumericField ? Number(editedValue) : editedValue;
    
    updatedTasks[rowIndex] = taskToUpdate;
    setTasks(updatedTasks);
    setEditingCell(null);
  };

  const handleAddTask = () => {
    const newTask = { 
      name: "New Task", 
      status: "Unassigned", 
      assignedTo: "",
      deadline: "",
      timeTaken: 0,
      cost: 0
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const statusCounts = useMemo(() => tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {}), [tasks]);

  const totals = useMemo(() => tasks.reduce((acc, task) => {
    acc.totalTime += Number(task.timeTaken) || 0;
    acc.totalCost += Number(task.cost) || 0;
    return acc;
  }, { totalTime: 0, totalCost: 0 }), [tasks]);

  const renderCell = (task, index, field) => {
    const isEditing = editingCell?.rowIndex === index && editingCell?.cellName === field;

    if (isEditing) {
      return (
        <input
          type={field === 'timeTaken' || field === 'cost' ? 'number' : 'text'}
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          onBlur={handleUpdateCell}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdateCell()}
          autoFocus
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      );
    }

    return (
      <div onClick={() => handleCellClick(index, field, task[field])} className="hover:bg-gray-200 p-2 rounded">
        {field === 'cost' ? `$${task[field]}` : task[field]}
        {field === 'timeTaken' && ' min'}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
        <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
            Home
        </button>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{eventTitle ? `Tasks for "${eventTitle}"` : "Task Dashboard"}</h1>
            <div className="flex items-center">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    View Dashboard
                </button>
                <button
                    onClick={handleAddTask}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Task
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.keys(statusColors).map(status => (
                <div key={status} className={`${statusColors[status]} p-4 rounded-lg text-center`}>
                    <h2 className="font-bold text-lg">{status}</h2>
                    <p className="text-2xl">{statusCounts[status] || 0}</p>
                </div>
            ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-center">#</th>
                <th className="py-2 px-4 border-b text-center">Task</th>
                <th className="py-2 px-4 border-b text-center">Status</th>
                <th className="py-2 px-4 border-b text-center">Assigned To</th>
                <th className="py-2 px-4 border-b text-center">Deadline</th>
                <th className="py-2 px-4 border-b text-center">Time Taken (min)</th>
                <th className="py-2 px-4 border-b text-center">Cost ($)</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{renderCell(task, index, 'name')}</td>
                  <td className="py-2 px-4 border-b">{renderCell(task, index, 'status')}</td>
                  <td className="py-2 px-4 border-b text-center">{renderCell(task, index, 'assignedTo')}</td>
                  <td className="py-2 px-4 border-b text-center">{renderCell(task, index, 'deadline')}</td>
                  <td className="py-2 px-4 border-b text-center">{renderCell(task, index, 'timeTaken')}</td>
                  <td className="py-2 px-4 border-b text-center">{renderCell(task, index, 'cost')}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleDeleteTask(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td colSpan="5" className="py-2 px-4 border-t text-right">Total:</td>
                <td className="py-2 px-4 border-t text-center">{totals.totalTime} min</td>
                <td className="py-2 px-4 border-t text-center">${totals.totalCost.toFixed(2)}</td>
                <td className="py-2 px-4 border-t"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
