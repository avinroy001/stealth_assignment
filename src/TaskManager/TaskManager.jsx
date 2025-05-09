import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import NewTask from "./NewTask";
import TaskCard from "./TaskCard";
import "./TaskManager.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editTask, setEditTask] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false);
    fetchTasks();
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
      const response = await axios.get(
        "https://stealth-assignment.onrender.com/task/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Active"
        ? task.status !== "complete"
        : task.status === "complete";

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="task-manager">
        <div>
          <Typography variant="h4">Task Manager</Typography>
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
        <FormControl size="small">
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search Tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <span role="img" aria-label="search">
                🔍
              </span>
            ),
          }}
          sx={{ flex: 1 }}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {loading && <p>Loading tasks...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onTaskUpdated={fetchTasks}
                onEditClick={openEditModal}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default TaskManager;
