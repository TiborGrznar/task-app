import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/Task";
import api from "../api/axios";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";


/**
 * Task list page. Loads the current user's tasks from the backend on mount
 * and displays them. Requires authentication (JWT is attached automatically
 * by the axios instance's request interceptor).
 */
function TaskList() {
    const navigate = useNavigate();
    const { logout, name } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Defined as a separate async function because the function passed
        // directly to useEffect cannot itself be async.
        async function loadData() {
            try{
                const response = await api.get("/tasks");
                setTasks(response.data);
            } catch (err) {
                console.error("Failed to load tasks!",err);
                setError("Failed to load tasks!");
            } finally {
                setLoading(false);
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

    function handleLogout() {
        logout();
        navigate("/login");
    } 
    

    // Derived views, recomputed from `tasks` on every render — not separate
    // state, so they can never get out of sync with the source of truth.
    const activeTasks = tasks.filter((task) => !task.done);
    const doneTasks = tasks.filter((task) => task.done);


    return (
        <div className="min-h-screen bg-neutral-900 py-10 px-4 relative">
            <div className="absolute top-4 right-4 flex items-center gap-3">
                <span className="text-sm text-neutral-300">{name}</span>
                <button onClick={handleLogout} className="text-sm px-3 py-1 bg-neutral-700 text-white font-medium rounded-md hover:bg-neutral-600 transition-colors cursor-pointer">
                    Logout
                </button>
            </div>

            <div className="max-w-2xl mx-auto bg-neutral-800 border border-neutral-700 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold text-white mb-4">My Tasks</h1>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <TaskForm onTaskCreated={addTaskToList} />

                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="w-8 h-8 border-4 border-neutral-700 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <p className="text-neutral-400 text-center py-6">No tasks yet — add one above!</p>
                ) : (
                    <>
                        {activeTasks.map((task) => (
                            <TaskItem key={task.id} task={task} onDelete={removeTaskFromList} onMarkDone={markTaskAsDone} onUnmarkDone={unmarkTaskAsDone} />
                        ))}
                        <hr className="my-4 border-neutral-700" />
                        {doneTasks.map((task) => (
                            <TaskItem key={task.id} task={task} onDelete={removeTaskFromList} onMarkDone={markTaskAsDone} onUnmarkDone={unmarkTaskAsDone} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default TaskList;