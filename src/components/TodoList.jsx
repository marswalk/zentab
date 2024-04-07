import React from "react";
import Task from "./Task";
import AddTaskForm from "./AddTaskForm";
import { v4 as uuidv4 } from "uuid";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";
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

    this.props.onTaskEdit("XX", "", "");
  };

  onDeleteTask = (taskId) => {
    const updatedTasks = this.state.tasks.filter((task) => task.id !== taskId);
    this.setState({ tasks: updatedTasks });
    this.props.onTaskDelete(taskId);
  };

  // Function to handle task addition
  onTaskAdd = (newTask) => {
    const { task, onTaskAdd } = this.props;

    const updatedTasks = [...this.state.tasks, newTask];
    this.setState({ tasks: updatedTasks }, () => {
      this.sortTasks(); // Sort tasks after adding new task
    });
    onTaskAdd(newTask);
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

  handleTaskEdit = (taskId, newText, newDate) => {
    const { task, onTaskEdit } = this.props;

    const updatedTasks = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, text: newText, dueDate: newDate };
      }
      return task;
    });
    this.setState({ tasks: updatedTasks }, () => {
      console.log(newDate, typeof newDate);
      console.log("TASK HAS BEEN EDITIEIED");
      this.sortTasks(); // Sort tasks after editing task
      onTaskEdit(taskId, newText, newDate);
    });
  };

  togglePin = (taskId, pinnedState) => {
    this.state.tasks.map((task) => {
      if (task.id === taskId) {
        task.pinned = pinnedState;
        // return { ...task, pinned: pinnedState };
      }
    });
    this.forceUpdate();
  };

  render() {
    const { isEditing, listTitle, tasks } = this.state;
    const pinnedTasks = tasks.filter((task) => task.pinned);
    const unpinnedTasks = tasks.filter((task) => !task.pinned);
    console.log("PINNED", pinnedTasks, unpinnedTasks);
    return (
      <div className="todo-list">
        {/* Render List Title */}
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem>
            <AccordionButton>
              {isEditing ? (
                <div>
                  <InputGroup>
                    <Input
                      type="text"
                      value={listTitle}
                      onChange={this.handleListTitleChange}
                    />
                    <InputRightElement>
                      <CheckIcon onClick={this.handleListRename} size="xs" />
                    </InputRightElement>
                  </InputGroup>
                </div>
              ) : (
                <Text
                  onClick={() => this.setState({ isEditing: true })}
                  fontSize="2xl"
                >
                  {listTitle}
                </Text>
              )}
              <IconButton
                aria-label="Delete List"
                variant="outline"
                colorScheme="white"
                onClick={this.handleListDelete}
                marginLeft="10px"
                marginRight="10px"
                marginTop="2px"
                size="xs"
                icon={<DeleteIcon />}
              />
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

export default TodoList;
