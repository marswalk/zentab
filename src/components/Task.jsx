import React from "react";
import {
  IconButton,
  Input,
  Text,
  Button,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { RiPushpinFill, RiUnpinFill } from "react-icons/ri";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: this.props.task.completed,
      isEditing: false,
      taskText: this.props.task.text,
      dueDate: this.props.task.dueDate,
      // dueDate: "",
      pinned: false, // New property to indicate if task is pinned
    };
  }

  toggleComplete = () => {
    this.setState({ completed: !this.state.completed });
    console.log("TTASK CHECKED AS DONE", this.state.completed);
  };

  togglePin = () => {
    const { task, onTaskEdit } = this.props;
    console.log("TESTER", this.state.pinned);
    this.setState({ pinned: !this.state.pinned });
  };

  handleTogglePin = () => {
    const { task, onTogglePin } = this.props;
    this.togglePin();
    onTogglePin(this.props.task.id, this.state.pinned);
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
        {isEditing ? (
          <div>
            <Stack direction="row" spacing={2}>
              <Input
                type="text"
                value={taskText}
                placeholder="Edited task can't be empty"
                _placeholder={{ opacity: 0.8, color: "white" }}
                onChange={this.handleTaskTextChange}
                size="sm"
                width="auto"
              />
              <Input
                type="date"
                value={dueDate}
                onChange={this.handleDueDateChange}
                size="sm"
                width="auto"
              />
              <IconButton
                onClick={this.handleTaskEdit}
                icon={<CheckIcon />}
                size="sm"
              />
            </Stack>
          </div>
        ) : (
          <Stack direction="row" spacing={2}>
            <Checkbox
              size="sm"
              colorScheme="green"
              isChecked={completed}
              onChange={this.toggleComplete}
            />
            <Text
              onClick={() => this.setState({ isEditing: true })}
              className={completed ? "completed-text" : ""}
              fontSize="xl"
            >
              {task.text}
            </Text>
            <Text fontSize="lg">- due {moment(dueDate).fromNow()}</Text>
            <IconButton
              onClick={this.handleTogglePin}
              icon={task.pinned ? <RiUnpinFill /> : <RiPushpinFill />}
              aria-label={task.pinned ? "Unpin" : "Pin"}
              size="xs"
            />
            <IconButton
              onClick={this.handleTaskDelete}
              aria-label="Delete Task"
              icon={<DeleteIcon />}
              size="xs"
            />
          </Stack>
        )}
      </div>
    );
  }
}

export default Task;
