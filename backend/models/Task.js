const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["complete", "incomplete"], default: "incomplete" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Task", taskSchema);