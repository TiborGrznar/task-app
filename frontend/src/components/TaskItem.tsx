import type { Task } from "../types/Task";
import api from "../api/axios";

interface TaskItemProps {
    task: Task;
    onDelete: (taskId: number) => void;
    onMarkDone: (taskId: number) => void;
    onUnmarkDone: (taskId: number) => void;
}

/**
 * Renders a single task row (done status + text) with a delete action.
 * Deletion is a two-step process: first the task is removed on the backend,
 * and only after that succeeds is the parent notified via onDelete, so the
 * UI stays in sync with the database.
 */
function TaskItem({ task, onDelete, onMarkDone, onUnmarkDone }: TaskItemProps) {

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

    async function handleUnmarkDone() {
        try {
            await api.patch(`/tasks/${task.id}/undone`);
            onUnmarkDone(task.id);
        } catch (err) {
            console.error("Failed to unmark task as undone!", err)
        }
    }


    return (
        <div className="flex items-center justify-between gap-3 py-2">
            <span className={
                task.done
                    ? "bg-neutral-900 border border-neutral-700 text-neutral-500 rounded-full px-5 py-2 line-through"
                    : "bg-neutral-900 border border-neutral-700 text-white rounded-full px-5 py-2"
            }>
                {task.text}
            </span>
            <div className="flex gap-2">
                {!task.done && (
                    <button onClick={handleMarkDone} className="text-sm px-3 py-1 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors cursor-pointer">
                        Mark done
                    </button>
                )}
                {task.done && (
                    <button onClick={handleUnmarkDone} className="text-sm px-3 py-1 bg-neutral-700 text-white font-medium rounded-md hover:bg-neutral-600 transition-colors cursor-pointer">
                        Unmark
                    </button>
                )}
                <button onClick={handleDelete} className="text-sm px-3 py-1 text-neutral-400 hover:text-red-400 font-medium transition-colors cursor-pointer">
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskItem;