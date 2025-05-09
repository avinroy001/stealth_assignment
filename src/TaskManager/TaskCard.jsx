import React, { useState , useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const TaskCard = ({ task, onTaskUpdated, onEditClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);



  
  

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://stealth-assignment.onrender.com/task/${task._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTaskUpdated(); 
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={status === "complete"}
              onChange={async () => {
                const token = localStorage.getItem("authToken");

                if (status === "incomplete") {
                  try {
                    const response = await axios.put(
                      `https://stealth-assignment.onrender.com/task/${task._id}/complete`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setStatus("complete");
                    onTaskUpdated();
                  } catch (err) {
                    console.error("Error marking as complete:", err);
                  }
                } else {
                  try {
                    const response = await axios.put(
                      `https://stealth-assignment.onrender.com/task/${task._id}`,
                      { ...task, status: "incomplete" },
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setStatus("incomplete");
                    onTaskUpdated();
                  } catch (err) {
                    console.error("Error marking as incomplete:", err);
                  }
                }
              }}
            />

            <Typography variant="body2">
              {status === "complete" ? "Complete" : "Incomplete"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton onClick={() => onEditClick(task)}>
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

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "#FFB3BA";
    case "Medium":
      return "#FFDFBA";
    case "High":
      return "#B3D7FF";
    default:
      return "#CCCCCC";
  }
};

export default TaskCard;