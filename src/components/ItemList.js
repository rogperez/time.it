import React, { Component } from 'react';
import TaskAdder from './TaskAdder';
import Task from './Task';
import TaskService from '../services/TaskService';
import '../styles/ItemList.css';

class ItemList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: TaskService.fetchAllTasks()
    }
  }

  componentDidMount() {
    setInterval(() => {
      TaskService.refreshAllTasks();
      this.setState({
        tasks: TaskService.fetchAllTasks()
      });
    }, 1000);
  }

  addTask = (taskName) => {
    const task = TaskService.add(taskName);
    if(task.created) {
      let newTasks = this.state.tasks;
      newTasks.push(task);
      this.setState({ tasks: newTasks });
    } else {
      alert(`Whoops. ${task.errorMessage}`);
    }
  }

  handleTaskDelete = (taskName) => {
    if(window.confirm(
      `Are you sure you want to delete ${taskName}`
    )) {
      TaskService.remove(taskName);
      this.setState({
        tasks: TaskService.fetchAllTasks()
      });
    }
  }

  handleStopAll = () => {
    TaskService.stopAllTasks();
    this.setState({tasks: TaskService.fetchAllTasks()});
  }

  handleTaskChange = (event) => {
    if(event.target.checked) {
      TaskService.start(event.target.value);
    } else {
      TaskService.stop(event.target.value);
    }

    this.setState({
      tasks: TaskService.fetchAllTasks()
    });
  }

  handleTaskEditName = (itemName) => {
    const newName = prompt(`Renaming task ${itemName}`, itemName);
    if(newName) {
      if(TaskService.rename(itemName, newName)) {
        this.setState({tasks: TaskService.fetchAllTasks()});
      } else {
        alert(`Can't. Task ${newName} already exists.`);
      }
    }
  }

  render() {
    const tasks = this.state.tasks.map((task) =>
      <Task
        key={task.name}
        task={task}
        handleTaskChange={this.handleTaskChange} 
        handleTaskDelete={this.handleTaskDelete}
        handleTaskEdit={this.handleTaskEditName} />
    );

    return (
      <div>
        <TaskAdder addTask={this.addTask} />
        <span>
          <button onClick={this.handleStopAll}>Stop All Items</button>
        </span>
        <div>
          {tasks}
        </div>
      </div>
    );
  }
}

export default ItemList;
