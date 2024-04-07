import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: this.props.task.completed,
      isEditing: false,
      taskText: this.props.task.text,
      dueDate: this.props.task.dueDate.format("YYYY-MM-DD"),
      pinned: false, // New property to indicate if task is pinned
    };
  }

  toggleComplete = () => {
    this.setState({ completed: !this.state.completed });
  };

  togglePin = () => {
    const { task, onTaskEdit } = this.props;
    const updatedTask = { ...task, pinned: !task.pinned };
    onTaskEdit(
      task.id,
      updatedTask.text,
      updatedTask.dueDate,
      updatedTask.completed,
      updatedTask.pinned,
    );
  };

  handleTogglePin = () => {
    const { task, onTogglePin } = this.props;
    onTogglePin(task.id);
  };

  handleTaskEdit = () => {
    const { taskText, dueDate } = this.state;
    if (!taskText.trim()) return;
    this.props.onTaskEdit(this.props.task.id, taskText, dueDate);
    this.setState({ isEditing: false });
    this.setState({ dueDate: dueDate });
    this.forceUpdate();
  };

  handleTaskDelete = () => {
    this.props.onDelete(this.props.task.id);
  };

  handleTaskTextChange = (event) => {
    this.setState({ taskText: event.target.value });
  };

  handleDueDateChange = (event) => {
    this.setState({ dueDate: event.target.value });
    this.forceUpdate();
  };

  render() {
    const { task } = this.props;
    const { completed, isEditing, taskText, dueDate } = this.state;

    return (
      <div className={`task ${completed ? "completed" : ""}`}>
        <div>
          <input
            type="checkbox"
            checked={completed}
            onChange={this.toggleComplete}
          />
          <span
            onClick={() => this.setState({ isEditing: true })}
            className={completed ? "completed-text" : ""}
          >
            {task.text}
          </span>
          <button onClick={this.handleTogglePin}>
            {task.pinned ? "Unpin" : "Pin"}
          </button>
        </div>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={taskText}
              onChange={this.handleTaskTextChange}
            />
            <input
              type="date"
              value={dueDate}
              onChange={this.handleDueDateChange}
            />
            <button onClick={this.handleTaskEdit}>Save</button>
          </div>
        ) : (
          <div>
            <span>{moment(dueDate).fromNow()}</span>
            <button onClick={this.handleTaskDelete}>Delete</button>
          </div>
        )}
      </div>
    );
  }
}

export default Task;
