import React, { useState } from "react";
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

const NewTaskModal = ({ onTaskCreated, taskToEdit = null, onTaskUpdated  }) => {
    const isEditMode = Boolean(taskToEdit);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("incomplete");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("authToken");
  
    try {
      const payload = { title, description, status, priority };
  
      const response = isEditMode
        ? await axios.put(`http://localhost:3001/task/${taskToEdit._id}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.post("http://localhost:3001/task/", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
      if (isEditMode) {
        onTaskUpdated(); // fetch updated task list
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
    <div>
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

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={modalStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Create New Task
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Enter the task details below.
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
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
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
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
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
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default NewTaskModal;