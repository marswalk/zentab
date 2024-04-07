import React from "react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      dueDate: "",
    };
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value });
  };

  handleDueDateChange = (event) => {
    this.setState({ dueDate: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { text, dueDate } = this.state;
    if (!text.trim() || !dueDate.trim()) return;
    const newTask = {
      id: uuidv4(),
      text,
      dueDate: moment(dueDate, "YYYY-MM-DD"),
      completed: false,
    };
    this.props.onTaskAdd(newTask); // Emitting event with new task
    this.setState({ text: "", dueDate: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Enter task"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input
          type="date"
          value={this.state.dueDate}
          onChange={this.handleDueDateChange}
        />
        <button type="submit">Add Task</button>
      </form>
    );
  }
}

export default AddTaskForm;
