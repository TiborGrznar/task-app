import type { Task } from "../types/Task";
import React, { useState } from "react";
import api from "../api/axios";
import axios from "axios";


interface TaskFormProps {
    onTaskCreated: (newTask: Task) => void;
}

/**
 * Form for creating a new task. Sends the entered text to the backend via
 * POST, and on success passes the full created task (including its
 * server-generated id and createdAt) up to the parent via onTaskCreated,
 * so it can be added to the task list without a page reload.
 */
function TaskForm({ onTaskCreated }: TaskFormProps) {

    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {

        event.preventDefault();

        try {
           const response = await api.post("/tasks", { text });
           onTaskCreated(response.data);
           setText("");
        } catch (err) {
          
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.")
            }
        }

    }
    
    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={text} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                    Add task
                </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </form>
    );
}

export default TaskForm;