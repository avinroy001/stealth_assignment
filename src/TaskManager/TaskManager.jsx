import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import NewTask from "./NewTask";
import TaskCard from "./TaskCard";
import "./TaskManager.css";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editTask, setEditTask] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

  
const handleNewTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };
  
  
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
  
      const token = localStorage.getItem("authToken");
  
      try {
        const response = await axios.get("https://stealth-assignment.onrender.com/task/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setTasks(response.data);
        console.log("Tasks fetched:", response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchTasks();
    }, []);
  
    return (
      <>
        <div className="task-manager">
          <div>
            <h1>Task Manager</h1>
          </div>
          <div>
          <NewTask
  onTaskCreated={handleNewTask}
  taskToEdit={editTask}
  onTaskUpdated={fetchTasks}
  isOpen={isModalOpen}
  setIsOpen={setIsModalOpen}
/>

          </div>
        </div>
  
        <Box sx={{ mt: 2 }}>
          {loading && <p>Loading tasks...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
  
          {!loading && !error && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onTaskUpdated={fetchTasks}  onEditClick={openEditModal}/>
              ))}
            </Box>
          )}
        </Box>
      </>
    );
  };
  

export default TaskManager;
