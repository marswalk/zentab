import React from "react";
import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  Image,
  Text,
  Flex,
  Button,
  Icon,
  ChakraProvider,
  Link,
} from "@chakra-ui/react";
import Background from "./components/Background"; // Import the Background component
import WebPlayback from "./WebPlayback";
import { FaSpotify } from "react-icons/fa";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      currentBackground: null, // State to store current background image URL
      token: undefined,
    };
  }

  componentDidMount() {
    this.setGreeting();
    this.setCurrentTime();
    const storedLists = localStorage.getItem("todoLists");
    console.log("LISTS", storedLists);
    if (storedLists) {
      this.setState({ lists: JSON.parse(storedLists) });
    }
    this.getToken();

    setInterval(() => this.setCurrentTime(), 1000);
  }
  componentDidUpdate() {
    console.log("UPDATING", JSON.stringify(this.state.lists));
    localStorage.setItem("todoLists", JSON.stringify(this.state.lists));
  }

  async getToken() {
    try {
      const token = localStorage.getItem("access_token");
      if (token === undefined || token === null) {
        return;
      }
      console.log("USING TOKEN", token);
      this.setState({ token: token });
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  setGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "";
    if (hour >= 0 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    this.setState({ greeting });
  };

  setCurrentTime = () => {
    const currentTime = moment().format("LT");
    this.setState({ currentTime });
  };

  setBackground = (background) => {
    this.setState({ currentBackground: background });
  };

  handleTaskAdd = (newTask, listId) => {
    const updatedLists = this.state.lists.map((list) => {
      if (list.id === listId) {
        return { ...list, tasks: [...list.tasks, newTask] };
      }
      return list;
    });
    this.setState({ lists: updatedLists });
    this.componentDidUpdate();
    console.log("HandleTaskAdd called App.jsx");
  };

  handleListDelete = (listId) => {
    const updatedLists = this.state.lists.filter((list) => list.id !== listId);
    this.setState({ lists: updatedLists });
    this.componentDidUpdate();
  };

  handleNewList = () => {
    const newList = {
      id: uuidv4(),
      title: "New List",
      tasks: [],
    };
    this.setState({ lists: [...this.state.lists, newList] });
    this.componentDidUpdate();
  };

  handleListRename = (listId, newTitle) => {
    const updatedLists = this.state.lists.map((list) => {
      if (list.id === listId) {
        return { ...list, title: newTitle };
      }
      return list;
    });
    this.setState({ lists: updatedLists });
    this.componentDidUpdate();
  };

  handleTaskEdit = (taskId, newText, newDate) => {
    const updatedLists = this.state.lists.map((list) => {
      const updatedTasks = list.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, text: newText, dueDate: newDate };
        }
        return task;
      });

      return { ...list, tasks: updatedTasks };
    });
    console.log("HANDLE TASK EDITED AFWF");
    this.setState({ lists: updatedLists });
    this.componentDidUpdate();
  };

  handleTaskDelete = (taskId) => {
    const updatedLists = this.state.lists.map((list) => {
      const updatedTasks = list.tasks.filter((task) => task.id !== taskId);
      return { ...list, tasks: updatedTasks };
    });
    this.setState({ lists: updatedLists });
    this.componentDidUpdate();
  };

  render() {
    const { greeting, currentTime } = this.state;
    const { token } = this.state;
    return (
      <ChakraProvider>
        <Flex
          position="relative"
          height="100vh"
          bg="radial-gradient(circle, rgba(49,81,244,1) 0%, rgba(255,44,44,1) 100%);"
          color="#eee"
          fontFamily="Inter"
          overflow="hidden"
        >
          <Image
            class="fillbackground"
            src={this.state.currentBackground}
            alt="Google Earth background cannot be fetched"
          />
          <Flex
            position="absolute"
            top="10px"
            left="10px"
            bg="rgba(150, 150, 150, 0.3)"
            borderRadius="10px"
            padding="20px"
            backdropFilter="auto"
            backdropBlur="6px"
          >
            <div className="greeting">
              <Text fontSize="2xl" as="b">
                {greeting},
              </Text>
              <Text fontSize="lg">the current time is {currentTime}</Text>
            </div>
          </Flex>
          <Flex
            position="absolute"
            top="10px"
            right="10px"
            flexDirection="column"
            alignItems="flex-end"
            bg="rgba(150, 150, 150, 0.3)"
            borderRadius="10px"
            padding="20px"
            maxWidth="60%"
            maxHeight="70%"
            backdropFilter="auto"
            backdropBlur="6px"
          >
            <Flex direction="row" overflowX="scroll" maxWidth="100%">
              {this.state.lists.map((list) => (
                <Flex
                  key={list.id}
                  flexDirection="column"
                  alignItems="flex-end"
                  bg="rgba(150, 150, 150, 0.3)"
                  color="#eee"
                  borderRadius="8px"
                  padding="10px"
                  margin="5px"
                  overflowY="scroll"
                  maxHeight="100%"
                >
                  <TodoList
                    key={list.id}
                    title={list.title}
                    tasks={list.tasks}
                    onTaskAdd={(newTask) =>
                      this.handleTaskAdd(newTask, list.id)
                    }
                    onListDelete={() => this.handleListDelete(list.id)}
                    onListRename={(newTitle) =>
                      this.handleListRename(list.id, newTitle)
                    }
                    onTaskEdit={(taskId, newText, newDate) =>
                      this.handleTaskEdit(taskId, newText, newDate)
                    }
                    onTaskDelete={(taskId) => this.handleTaskDelete(taskId)}
                  />
                </Flex>
              ))}
            </Flex>
            <Button onClick={this.handleNewList} marginTop="10px" size="sm">
              Create New List
            </Button>
          </Flex>

          <Flex
            position="absolute"
            bottom="10px"
            left="10px"
            bg="rgba(150, 150, 150, 0.3)"
            borderRadius="10px"
            padding="20px"
            boxShadow="md"
            backdropFilter="auto"
            backdropBlur="8px"
          >
            {token === undefined ? (
              <Link href="/auth/login">
                <Button>
                  <FaSpotify fontSize="lg" />
                  &nbsp; Connect Spotify
                </Button>
              </Link>
            ) : (
              <WebPlayback token={token} />
            )}
          </Flex>

          <Flex
            position="absolute"
            bottom="10px"
            right="10px"
            bg="rgba(150, 150, 150, 0.3)"
            borderRadius="10px"
            padding="20px"
            boxShadow="2xl"
            backdropFilter="auto"
            backdropBlur="8px"
          >
            <Background setBackground={this.setBackground} />
          </Flex>
        </Flex>
      </ChakraProvider>
    );
  }
}
