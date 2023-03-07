const Task = ({ index, onChange, onEdit, onDelete, ...task }) => {
  return (
    <li>
      <input defaultValue={task.title} onChange={onChange} />
      <button onClick={() => onEdit({ id: task.id, index })}>edit</button>
      <button onClick={() => onDelete({ id: task.id, index })}>delete</button>
    </li>
  );
};

export default Task;
