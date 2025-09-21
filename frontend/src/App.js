import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import TaskDashboard from './TaskDashboard';
import EventForm from './EventForm';
import HeroMVP from './components/HeroMVP';
import Dashboard from './Dashboard';
import TodoPage from './TodoPage';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

const AppContent = () => {
  const [tasks, setTasks] = useState([
    { name: "Task 1", status: "Unassigned", assignedTo: "", deadline: "", timeTaken: 0, cost: 0 },
    { name: "Task 2", status: "Assigned", assignedTo: "Alice", deadline: "2024-08-15", timeTaken: 300, cost: 100 },
    { name: "Task 3", status: "In Progress", assignedTo: "Bob", deadline: "2024-08-20", timeTaken: 180, cost: 50 },
    { name: "Task 4", status: "Completed", assignedTo: "Charlie", deadline: "2024-08-10", timeTaken: 480, cost: 200 },
    { name: "Task 5", status: "Unassigned", assignedTo: "", deadline: "", timeTaken: 0, cost: 0 },
    { name: "Task 6", status: "Assigned", assignedTo: "David", deadline: "2024-08-18", timeTaken: 120, cost: 75 },
    { name: "Task 7", status: "In Progress", assignedTo: "Eve", deadline: "2024-08-22", timeTaken: 60, cost: 25 },
    { name: "Task 8", status: "Completed", assignedTo: "Frank", deadline: "2024-08-12", timeTaken: 600, cost: 300 },
    { name: "Task 9", status: "Unassigned", assignedTo: "", deadline: "", timeTaken: 0, cost: 0 },
    { name: "Task 10", status: "Assigned", assignedTo: "Grace", deadline: "2024-08-25", timeTaken: 240, cost: 150 },
    { name: "Task 11", status: "In Progress", assignedTo: "Heidi", deadline: "2024-08-28", timeTaken: 360, cost: 250 },
    { name: "Task 12", status: "Completed", assignedTo: "Ivan", deadline: "2024-08-14", timeTaken: 720, cost: 400 },
    { name: "Task 13", status: "Unassigned", assignedTo: "", deadline: "", timeTaken: 0, cost: 0 },
    { name: "Task 14", status: "Assigned", assignedTo: "Judy", deadline: "2024-08-27", timeTaken: 420, cost: 175 },
    { name: "Task 15", status: "In Progress", assignedTo: "Mallory", deadline: "2024-08-30", timeTaken: 540, cost: 350 },
  ]);
  const [todos, setTodos] = useState([]);
  const [eventTitle, setEventTitle] = useState(""); // Add state for event title
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTodos(todosData);
    });
    return unsubscribe;
  }, []);

  const addTodo = async (text) => {
    await addDoc(collection(db, "todos"), { text: text, completed: false });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleOpenCreate = () => {
    navigate('/create');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HeroMVP onOpenCreate={handleOpenCreate} />} 
      />
      <Route 
        path="/create" 
        element={<EventForm setTasks={setTasks} setEventTitle={setEventTitle} />} // Pass setEventTitle
      />
      <Route 
        path="/tasks" 
        element={<TaskDashboard tasks={tasks} setTasks={setTasks} eventTitle={eventTitle} />} // Pass eventTitle
      />
      <Route 
        path="/dashboard" 
        element={<Dashboard tasks={tasks} />} 
      />
      <Route 
        path="/todo" 
        element={<TodoPage todos={todos} addTodo={addTodo} deleteTodo={deleteTodo} />} 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
