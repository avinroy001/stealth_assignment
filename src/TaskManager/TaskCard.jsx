import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { red } from "@mui/material/colors";

const TaskCard = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:3001/task/${task._id}`,
        { title, description, status, priority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTaskUpdated(); // Refresh tasks
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:3001/task/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskUpdated(); // Refresh tasks
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: getPriorityColor(priority),
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                marginRight: "8px",
              }}
            >
              {priority}
            </span>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
  checked={status === "complete"}
  onChange={async () => {
    const newStatus = status === "complete" ? "incomplete" : "complete";
    setStatus(newStatus);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:3001/task/${task._id}`, {
        ...task,
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskUpdated();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  }}
/>

            <Typography variant="body2">{status === "complete" ? "Complete" : "Incomplete"}</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton onClick={() => setIsEditing(!isEditing)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Helper function to map priority to colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "#FFB3BA"; // Light Red
    case "Medium":
      return "#FFDFBA"; // Light Yellow
    case "High":
      return "#B3D7FF"; // Light Blue
    default:
      return "#CCCCCC"; // Gray
  }
};

export default TaskCard;