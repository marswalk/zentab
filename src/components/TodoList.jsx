import React from "react";
import Task from "./Task";
import AddTaskForm from "./AddTaskForm";
import { v4 as uuidv4 } from "uuid";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      isEditing: false,
      listTitle: this.props.title,
    };
  }

  // Function to sort tasks by due date using Insertion Sort
  insertionSort = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      let currentTask = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j].dueDate > currentTask.dueDate) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = currentTask;
    }
    return arr;
  };

  // Call this function whenever tasks are updated
  sortTasks = () => {
    const sortedTasks = this.insertionSort([...this.state.tasks]);
    this.setState({ tasks: sortedTasks });
  };

  onDeleteTask = (taskId) => {
    const updatedTasks = this.state.tasks.filter((task) => task.id !== taskId);
    this.setState({ tasks: updatedTasks });
  };

  // Function to handle task addition
  onTaskAdd = (newTask) => {
    const updatedTasks = [...this.state.tasks, newTask];
    this.setState({ tasks: updatedTasks }, () => {
      this.sortTasks(); // Sort tasks after adding new task
    });
  };

  handleListDelete = () => {
    this.props.onListDelete();
  };

  handleListRename = () => {
    const { listTitle } = this.state;
    if (!listTitle.trim()) return;
    this.props.onListRename(listTitle);
    this.setState({ isEditing: false });
  };

  handleListTitleChange = (event) => {
    this.setState({ listTitle: event.target.value });
  };

  handleTaskEdit = (taskId, newText) => {
    const updatedTasks = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, text: newText };
      }
      return task;
    });
    this.setState({ tasks: updatedTasks }, () => {
      console.log("TASK HAS BEEN EDITIEIED");
      this.sortTasks(); // Sort tasks after editing task
    });
  };

  render() {
    const { isEditing, listTitle, tasks } = this.state;
    const pinnedTasks = tasks.filter((task) => task.pinned);
    const unpinnedTasks = tasks.filter((task) => !task.pinned);

    return (
      <div className="todo-list">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={listTitle}
              onChange={this.handleListTitleChange}
            />
            <button onClick={this.handleListRename}>Save</button>
          </div>
        ) : (
          <h2 onClick={() => this.setState({ isEditing: true })}>
            {listTitle}
          </h2>
        )}

        {/* Render Pinned Tasks */}
        {pinnedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={this.onDeleteTask}
            onTaskEdit={this.handleTaskEdit}
            onTogglePin={this.togglePin}
          />
        ))}

        {/* Render Unpinned Tasks */}
        {unpinnedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={this.onDeleteTask}
            onTaskEdit={this.handleTaskEdit}
            onTogglePin={this.togglePin}
          />
        ))}
        <AddTaskForm onTaskAdd={this.onTaskAdd} />

        <button onClick={this.handleListDelete}>Delete List</button>
      </div>
    );
  }
}

export default TodoList;
