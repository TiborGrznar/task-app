import type { Task } from "../types/Task";
import api from "../api/axios";

interface TaskItemProps {
    task: Task;
    onDelete: (taskId: number) => void;
}

/**
 * Renders a single task row (done status + text) with a delete action.
 * Deletion is a two-step process: first the task is removed on the backend,
 * and only after that succeeds is the parent notified via onDelete, so the
 * UI stays in sync with the database.
 */
function TaskItem({ task, onDelete }: TaskItemProps) {

    async function handleDelete() {
            try {
                await api.delete(`/tasks/${task.id}`);
                onDelete(task.id);
            } catch (err) {
                console.error("Failed to delete task!", err);
            }
        }

    return (
        <div>
            <span>{task.done ? "✅" : "⬜"}</span>
            <span>{task.text}<button onClick={handleDelete}>Delete</button></span>
        </div>
    );
}

export default TaskItem;