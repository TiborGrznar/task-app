import type { Task } from "../types/Task";

interface TaskItemProps {
    task: Task;
}

function TaskItem({ task }: TaskItemProps) {
    return (
        <div>
            <span>{task.done ? "✅" : "⬜"}</span>
            <span>{task.text}</span>
        </div>
    );
}

export default TaskItem;