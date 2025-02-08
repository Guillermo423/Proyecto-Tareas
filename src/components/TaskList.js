import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
      setError('');
    } catch (error) {
      setError('Error al obtener las tareas.');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setUpdatedTitle(task.title);
  };

  const handleUpdate = async (id) => {
    if (!updatedTitle.trim()) {
      setError('El título de la tarea no puede estar vacío.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: updatedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Tarea actualizada correctamente.');
      setError('');
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      setError('Error al actualizar la tarea.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Tarea eliminada correctamente.');
      setError('');
      fetchTasks();
    } catch (error) {
      setError('Error al eliminar la tarea.');
    }
  };

  return (
    <div>
      <h2>Lista de Tareas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {editingTask === task._id ? (
                <div>
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(task._id)}>Guardar</button>
                </div>
              ) : (
                <>
                  <strong>{task.title}</strong> - {task.status ? 'Completada' : 'Pendiente'}
                  <button onClick={() => handleEditClick(task)}>Editar</button>
                  <button onClick={() => handleDelete(task._id)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tareas disponibles.</p>
      )}
    </div>
  );
}

export default TaskList;
