✅ README.md
# Task Manager App 📝

A full-stack Task Management application built with **React (MUI)** on the frontend and **Node.js, Express, MongoDB** on the backend. Authenticated users can create, update, delete, and manage their tasks by status and priority.

---

## 🚀 Tech Stack

- **Frontend:** React, Material UI (MUI), Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT-based token auth
- **Database:** MongoDB (Atlas or local)

---

## 📁 Project Structure

task-manager/
│
├── backend/ # Express + MongoDB server
│ ├── controllers/ # Task and auth logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Route handlers
│ ├── middleware/ # Auth middleware
│ └── server.js # Main server file
│
├── frontend/ # React app with MUI
│ ├── components/ # UI components (TaskCard, NewTaskModal, etc.)
│ └── App.js # Main App file
│
└── README.md # You're here


---

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
Install dependencies:
npm install
Create a .env file:
PORT=3001
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_here
Start the backend server:
npm i
npm start
It will run at: http://localhost:3001/
Frontend Setup
Navigate to the frontend folder:
cd frontend
Install dependencies:
npm install
Update your API base URL if needed:
In axios.defaults.baseURL or relevant request file, make sure it's set to:
http://localhost:3001/
Start the frontend dev server:
npm i
npm start
It will run at: http://localhost:3000/
💾 Database Schema (MongoDB)

🧾 Task Schema
{
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}
👤 User Schema
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Hashed using bcrypt
}
✅ Features

🔐 User registration and login (JWT)
📋 Create, update, and delete tasks
📌 Prioritize tasks (Low / Medium / High)
📅 Set due dates
✅ Mark tasks as complete/incomplete
🌙 Dark mode ready (with MUI theming)
🧼 Error handling and form validation
🔄 Loading states for API calls
🧪 Run Locally

Start backend:
cd backend
 npm i
npm start
Start frontend in a new terminal:
cd frontend
 npm i
npm start
Visit: http://localhost:3000/
📬 API Endpoints Summary

Method	Route	Description
POST	/auth/register	Register a user
POST	/auth/login	Login & get token
GET	/task/	Get all tasks
POST	/task/	Create a task
PUT	/task/:id	Update task
DELETE	/task/:id	Delete task
📦 Future Improvements

Tag support / filtering
File attachments
Drag-and-drop task sorting
Admin dashboard
🧑‍💻 Author

Developed by Avinash Roy