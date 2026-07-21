import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./pages/TaskList";

function App() {
  return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route 
      path="/tasks"
      element={
        <PrivateRoute>
          <TaskList />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/tasks" replace />} />
  </Routes>
  )
}

export default App;