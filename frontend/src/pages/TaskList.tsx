import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Task } from "../types/Task";
import TaskItem from "../components/TaskItem";

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

    
    // Passed to TaskItem as the onDelete prop. Called after the task has
    // already been deleted on the backend, to remove it from local state too.
    function removeTaskFromList(taskId: number) {
        setTasks(tasks.filter((task) => task.id !== taskId));
    }

    return (
        <div>
            {error && <p>{error}</p>}
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onDelete={removeTaskFromList} />
            ))}
        </div>
    );
}

export default TaskList;