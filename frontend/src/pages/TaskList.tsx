import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Task } from "../types/Task";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";

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
                console.error("Failed to load tasks!");
                setError("Failed to load tasks!");
            }
        }
        loadData();
    }, []);  // empty dependency array -> runs once, on mount


    // Passed to TaskItem as the onDelete prop. Called after the task has
    // already been deleted on the backend, to remove it from local state too.
    function removeTaskFromList(taskId: number) {
        setTasks(tasks.filter((task) => task.id !== taskId));
    }


    /**  
    * Passed to TaskForm as the onTaskCreated prop. Called with the newly
    * created task (as returned by the backend, including its generated id)
    * once creation succeeds. The spread operator (...tasks) copies the
    * existing tasks into a new array with newTask appended, since React
    * state must never be mutated directly (e.g. via tasks.push()).
    */
    function addTaskToList(newTask: Task) {
        setTasks([...tasks, newTask]);
    }


    /**  Passed to TaskItem as the onMarkDone prop. Called after the task has
    * already been marked done on the backend. Uses map (not filter) because
    * the task stays in the list, only its `done` property changes.
    * The spread operator (...task) copies the existing fields and overrides
    * `done`, since React state must never be mutated directly.
    */
    function markTaskAsDone(taskId: number) {
        setTasks(tasks.map((task) => 
            task.id === taskId ? { ...task, done: true } : task
    ));
    }

    /** 
    * Passed to TaskItem as the onMarkUndone prop. Called after a task has
    * already been unmarked on the backend. Same immutable update pattern as
    * markTaskAsDone, just setting `done` back to false instead of true.
    */
    function unmarkTaskAsDone(taskId: number) {
        setTasks(tasks.map((task) => 
            task.id === taskId ? { ...task, done: false } : task
        ));
    }

    // Derived views, recomputed from `tasks` on every render — not separate
    // state, so they can never get out of sync with the source of truth.
    const activeTasks = tasks.filter((task) => !task.done);
    const doneTasks = tasks.filter((task) => task.done);


    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">

                {error && <p className="text-red-600 text-2xl-sm mb-4">{error}</p>}

                <TaskForm onTaskCreated={addTaskToList} />

                <div>
                    {activeTasks.map((task) => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onDelete={removeTaskFromList} 
                            onMarkDone={markTaskAsDone}
                            onUnmarkDone={unmarkTaskAsDone}
                        />
                    ))}
                </div>

                <hr className="my-4 border-gray-200" />

                <div>
                    {doneTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDelete={removeTaskFromList}
                            onMarkDone={markTaskAsDone}
                            onUnmarkDone={unmarkTaskAsDone}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskList;