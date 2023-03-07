import React, { useState, useEffect } from "react";
import axios from "axios";
import Task from "./Task";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("https://jsonplaceholder.typicode.com/todos", {
        params: {
          _start: 0,
          _end: 10,
        },
      })
      .then((response) => setTasks(response.data))
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddTask = () => {
    const newTaskObject = { title: newTask, completed: false };
    setLoading(true);
    axios
      .post("https://jsonplaceholder.typicode.com/todos", newTaskObject)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteTask = ({ id, index }) => {
    setLoading(true);
    axios
      .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        const nextTasks = [...tasks];
        nextTasks.splice(index, 1);
        setTasks(nextTasks);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = ({ currentTarget }, index) => {
    const nextTasks = [...tasks];
    nextTasks[index]["title"] = currentTarget.value;
    setTasks([...nextTasks]);
  };

  const handleEditTask = ({ id, index }) => {
    setLoading(true);
    axios
      .put(`https://jsonplaceholder.typicode.com/todos/${id}`, tasks[index])
      .then(() => {
        const nextTasks = [...tasks];
        nextTasks[index]["title"] = currentTarget.value;
        setTasks([...nextTasks]);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task, index) => (
          <Task
            {...task}
            index={index}
            key={`task-${index}`}
            onChange={(e) => handleChange(e, index)}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        ))}
      </ul>

      {loading && <p>loading</p>}

      <input
        type="text"
        id="new-task"
        name="new-task"
        aria-label="new-task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskList;
