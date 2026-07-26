import type { Task } from "../types/Task";
import api from "../api/axios";

interface TaskItemProps {
    task: Task;
    onDelete: (taskId: number) => void;
    onMarkDone: (taskId: number) => void;
}

/**
 * Renders a single task row (done status + text) with a delete action.
 * Deletion is a two-step process: first the task is removed on the backend,
 * and only after that succeeds is the parent notified via onDelete, so the
 * UI stays in sync with the database.
 */
function TaskItem({ task, onDelete, onMarkDone }: TaskItemProps) {

    async function handleDelete() {
            try {
                await api.delete(`/tasks/${task.id}`);
                onDelete(task.id);
            } catch (err) {
                console.error("Failed to delete task!", err);
            }
        }

    async function handleMarkDone() {
        try {
            await api.patch(`/tasks/${task.id}/done`);
            onMarkDone(task.id);
        } catch (err) {
            console.error("Failed to mark task as done!",err);
        }
    }


    return (
        <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
                <span>{task.done ? "✅" : "⬜"}</span>
                <span className={task.done ? "text-gray-400 line-through" : "text-gray-900"}>
                    {task.text}
                </span>
            </div>
            <div className="flex gap-2">
                {/* Only offer "mark done" for tasks that aren't done yet — 
                    un-marking is a deferred feature, not part of MVP */}
                {!task.done && (
                <button 
                    onClick={handleMarkDone}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Mark done
                </button>
                )}
                <button 
                    onClick={handleDelete}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskItem;