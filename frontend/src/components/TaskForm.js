import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onTaskAdded }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: ''
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onTaskAdded(response.data);
      setTaskData({ title: '', description: '', dueDate: '', priority: '' });
    } catch (error) {
      alert('Error al crear la tarea');
    }
  };

  return (
    <div>
      <h2>Crear Tarea</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={taskData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={taskData.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dueDate"
          value={taskData.dueDate}
          onChange={handleChange}
        />
        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <button type="submit">Agregar Tarea</button>
      </form>
    </div>
  );
}

export default TaskForm;
