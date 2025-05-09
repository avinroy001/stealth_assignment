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

const NewTask = ({ onTaskCreated, taskToEdit = null, onTaskUpdated, isOpen, setIsOpen }) => {
  const isEditMode = Boolean(taskToEdit);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("incomplete");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form fields when editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setDueDate(taskToEdit.dueDate?.substring(0, 10) || "");
      setPriority(taskToEdit.priority || "Medium");
      setStatus(taskToEdit.status || "incomplete");
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setStatus("incomplete");
    setError("");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("authToken");

    const payload = {
      title,
      description,
      dueDate,
      priority,
      status,
    };

    try {
      if (isEditMode) {
        await axios.put(`https://stealth-assignment.onrender.com/task/${taskToEdit._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onTaskUpdated(); // refresh task list
      } else {
        const response = await axios.post("https://stealth-assignment.onrender.com/task/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onTaskCreated(response.data); // add new task to UI
      }

      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {isEditMode ? "Edit Task" : "Create New Task"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {isEditMode ? "Update the task details below." : "Enter the task details below."}
        </Typography>

        <form onSubmit={handleSubmit}>
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
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
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
            <Button
              onClick={handleClose}
              variant="outlined"
              color="secondary"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ fontWeight: 600 }}
            >
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default NewTask;
