import React from "react";
import TodoList from "./components/TodoList";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Background from "./components/Background"; // Import the Background component
import WebPlayback from "./WebPlayback";
import Login from "./Login";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      currentBackground: null, // State to store current background image URL
      token: "",
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
  }

  componentDidUpdate() {
    console.log("UPDATING", JSON.stringify(this.state.lists));
    localStorage.setItem("todoLists", JSON.stringify(this.state.lists));
  }

  async getToken() {
    try {
      const response = await fetch("/auth/token");
      const json = await response.json();
      this.setState({ token: json.access_token });
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

  handleTaskEdit = (taskId, newText) => {
    const updatedLists = this.state.lists.map((list) => {
      const updatedTasks = list.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, text: newText };
        }
        return task;
      });
      return { ...list, tasks: updatedTasks };
    });
    this.setState({ lists: updatedLists });
    this.componentDidUpdate();
  };

  render() {
    const { greeting, currentTime } = this.state;
    const { token } = this.state;
    return (
      <div
        className="app"
        style={{ backgroundImage: `url(${this.state.currentBackground})` }}
      >
        <div className="top-left">
          <div className="greeting">
            <p>
              {greeting}, the current time is {currentTime}
            </p>
          </div>
        </div>
        <div className="top-right">
          {this.state.lists.map((list) => (
            <TodoList
              key={list.id}
              title={list.title}
              tasks={list.tasks}
              onTaskAdd={(newTask) => this.handleTaskAdd(newTask, list.id)}
              onListDelete={() => this.handleListDelete(list.id)}
              onListRename={(newTitle) =>
                this.handleListRename(list.id, newTitle)
              }
              onTaskEdit={(taskId, newText) =>
                this.handleTaskEdit(taskId, newText)
              }
            />
          ))}
          <div className="buttons">
            <button onClick={this.handleNewList}>Create New List</button>
          </div>
        </div>

        <div className="bottomLeft">
          {token === "" ? <Login /> : <WebPlayback token={token} />}
        </div>

        <div className="bottom-right">
          <Background setBackground={this.setBackground} />
        </div>
      </div>
    );
  }
}
