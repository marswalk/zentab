import React from "react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  Button,
  IconButton,
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      dueDate: "",
      textValid: true,
      dateValid: true,
    };
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value });
    this.setState({ textValid: true });
  };

  handleDueDateChange = (event) => {
    this.setState({ dueDate: event.target.value });
    this.setState({ dateValid: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { text, dueDate } = this.state;

    this.setState({ textValid: text.trim().length !== 0 });
    this.setState({ dateValid: dueDate.trim().length !== 0 });

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
    const { textValid, dateValid } = this.state;

    const handleInputChange = (e) => setInput(e.target.value);

    return (
      <form onSubmit={this.handleSubmit}>
        <Stack direction="row" spacing={2} marginTop="10px">
          <FormControl isInvalid={!textValid}>
            <Input
              type="text"
              placeholder="New task"
              _placeholder={{ opacity: 0.8, color: "white" }}
              value={this.state.text}
              onChange={this.handleTextChange}
              size="sm"
              width="auto"
            />
          </FormControl>
          <FormControl isInvalid={!dateValid}>
            <Input
              type="date"
              value={this.state.dueDate}
              onChange={this.handleDueDateChange}
              size="sm"
              width="auto"
            />
          </FormControl>
          <IconButton
            type="submit"
            aria-label="Add Task"
            icon={<ArrowUpIcon />}
            size="sm"
          />
        </Stack>
      </form>
    );
  }
}

export default AddTaskForm;
