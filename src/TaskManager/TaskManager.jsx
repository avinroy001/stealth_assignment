import React, { useState, useEffect } from "react";
import axios from "axios";
import NewTask from "./NewTask";
import "./TaskManager.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("http://localhost:3001/task/", {
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

    fetchTasks();
  }, []);

  return (
    <>
      <div className="task-manager">
        <div>
          <h1>Task Manager</h1>
        </div>
        <div>
          <NewTask />
        </div>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task._id || task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TaskManager;
