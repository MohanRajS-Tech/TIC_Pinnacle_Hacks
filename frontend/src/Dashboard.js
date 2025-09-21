import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const statusColors = {
    unassigned: 'rgba(201, 203, 207, 0.7)', // Gray
    assigned: 'rgba(54, 162, 235, 0.7)', // Blue
    inProgress: 'rgba(255, 206, 86, 0.7)', // Yellow
    completed: 'rgba(75, 192, 192, 0.7)', // Green
};

const statusBorderColors = {
    unassigned: 'rgba(201, 203, 207, 1)',
    assigned: 'rgba(54, 162, 235, 1)',
    inProgress: 'rgba(255, 206, 86, 1)',
    completed: 'rgba(75, 192, 192, 1)',
};

const Dashboard = ({ tasks }) => {
  const navigate = useNavigate();

  const dashboardData = useMemo(() => {
    const statusCounts = { unassigned: 0, assigned: 0, inProgress: 0, completed: 0 };
    const timeByStatus = { unassigned: 0, assigned: 0, inProgress: 0, completed: 0 };
    const costByStatus = { unassigned: 0, assigned: 0, inProgress: 0, completed: 0 };
    let totalTime = 0;
    let totalCost = 0;

    tasks.forEach(task => {
        const statusKey = task.status.charAt(0).toLowerCase() + task.status.slice(1).replace(' ', '');
        if (statusKey in statusCounts) {
            statusCounts[statusKey]++;
            timeByStatus[statusKey] += task.timeTaken || 0;
            costByStatus[statusKey] += task.cost || 0;
        }
        totalTime += task.timeTaken || 0;
        totalCost += task.cost || 0;
    });

    return { statusCounts, timeByStatus, costByStatus, totalTime, totalCost };
  }, [tasks]);

  const { statusCounts, timeByStatus, costByStatus, totalTime, totalCost } = dashboardData;

  const doughnutChartData = {
    labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1').trim()),
    datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: Object.values(statusColors),
        borderColor: Object.values(statusBorderColors),
        borderWidth: 1,
    }],
  };

  const barChartData = (data, label) => ({
    labels: Object.keys(data).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1').trim()),
    datasets: [{
        label,
        data: Object.values(data),
        backgroundColor: Object.values(statusColors),
    }],
  });

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: true, text: title } },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <button 
        onClick={() => navigate('/tasks')} 
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Back to Tasks
      </button>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Event Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg text-center">
                <h2 className="text-xl font-bold text-blue-800">Total Estimated Time</h2>
                <p className="text-3xl font-semibold">{totalTime} min</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg text-center">
                <h2 className="text-xl font-bold text-green-800">Total Estimated Cost</h2>
                <p className="text-3xl font-semibold">${totalCost.toFixed(2)}</p>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Task Status Overview</h2>
            <div className="relative h-64"><Doughnut data={doughnutChartData} options={{...chartOptions(''), plugins: { legend: { position: 'bottom'}}}} /></div>
          </div>
          <div className="lg:col-span-2 grid grid-rows-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="relative h-48"><Bar data={barChartData(timeByStatus, 'Time (min)')} options={chartOptions('Time Distribution by Status')} /></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="relative h-48"><Bar data={barChartData(costByStatus, 'Cost ($)')} options={chartOptions('Cost Distribution by Status')} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
