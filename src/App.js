import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthForm from './AuthForm';
import TaskManager from './TaskManager/TaskManager';
function App() {
  return (
    <Routes>
      <Route path='/' element={<AuthForm />}/>
      <Route path='/task' element={<TaskManager/>}/>
    </Routes>
  );
}

export default App;
