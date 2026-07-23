import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Task } from "../types/Task";

/**
 * Task list page. Loads the current user's tasks from the backend on mount
 * and displays them. Requires authentication (JWT is attached automatically
 * by the axios instance's request interceptor).
 */
function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        // Defined as a separate async function because the function passed
        // directly to useEffect cannot itself be async.
        async function loadData() {
            try{
                const response = await api.get("/tasks");
                setTasks(response.data);
            } catch (err) {
                setError("Failed to load tasks!")
            }
        }
        loadData();
    }, []);  // empty dependency array -> runs once, on mount

    return (
        <div>
            {error && <p>{error}</p>}
            {tasks.map((task) => (
                <div key={task.id}>{task.text}</div>
            ))}
        </div>
    );
}

export default TaskList;