import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Todo.css';

const TodoPage = ({ todos, addTodo, deleteTodo }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    addTodo(newTodo);
    setNewTodo('');
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id);
  };

  return (
    <div className="todo-page">
      <div className="todo-container">
        <h1 className="todo-header">To-Do List</h1>
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new to-do"
            className="todo-input"
          />
          <button type="submit" className="todo-button">Add</button>
        </form>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <span>{todo.text}</span>
              <button onClick={() => handleDeleteTodo(todo.id)} className="todo-delete-button">Delete</button>
            </li>
          ))}
        </ul>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    </div>
  );
};

export default TodoPage;
