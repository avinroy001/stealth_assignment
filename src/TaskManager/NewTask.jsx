import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const NewTaskModal = ({ onTaskCreated, taskToEdit, onTaskUpdated, isOpen, setIsOpen }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("incomplete");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setIsEditMode(true);
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "");
      setPriority(taskToEdit.priority || "Medium");
      setStatus(taskToEdit.status || "incomplete");
    } else {
      setIsEditMode(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setStatus("incomplete");
    }
  }, [taskToEdit]);

  const handleOpen = () => {
    if(!isEditMode){
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setStatus("incomplete");
    }
    setIsOpen(true);
  }
  const handleClose = () => {
    setIsOpen(false);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const token = localStorage.getItem("token");
    const payload = { title, description, status, priority, dueDate };
  
    try {
      const response = isEditMode
        ? await axios.put(
            `https://stealth-assignment.onrender.com/task/${taskToEdit._id}`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(
            "https://stealth-assignment.onrender.com/task/",
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
      if (isEditMode) {
        onTaskUpdated(); 
      } else {
        onTaskCreated(response.data); 
      }
  
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit task.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark" },
          fontWeight: 600,
        }}
      >
        Create Task
      </Button>

      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {isEditMode ? "Edit Task" : "Create New Task"}
          </Typography>

          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="dense"
            required
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="Priority">
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MenuItem value="incomplete">Incomplete</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Typography variant="body2" color="error" mt={2}>
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewTaskModal;