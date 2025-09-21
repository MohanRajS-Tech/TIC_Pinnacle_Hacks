import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventForm = ({ setTasks, setEventTitle }) => {
  const [eventTitleValue, setEventTitleValue] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [loading, ] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEventTitle(eventTitleValue); // Set the event title in the parent component
    
    // Navigate directly to the tasks page to see the sample tasks
    navigate('/tasks');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Home
      </button>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create a New Plan</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="eventTitle" className="block text-gray-700 font-bold mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="eventTitle"
              value={eventTitleValue}
              onChange={(e) => setEventTitleValue(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="eventType" className="block text-gray-700 font-bold mb-2">
              Type Of Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., hackathon, Team Meeting, festival"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Generating Tasks...' : 'Generate Tasks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
