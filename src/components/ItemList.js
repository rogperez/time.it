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

  addTask = (taskName) => {
    const task = TaskService.add(taskName);
    if(task.created) {
      let newTasks = this.state.tasks;
      newTasks.push(task);
      this.setState({ tasks: newTasks });
    } else {
      alert(`Dang! ${task.errorMessage}`);
    }
  }

  handleTaskDelete = (event) => {
    event.preventDefault();
    this.clearTasks();
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

  clearTasks = () => {
    this.setState({selectedTask: null});
  }

  render() {
    const tasks = this.state.tasks.map((task) =>
      <Task key={task.name} task={task} handleTaskChange={this.handleTaskChange} />
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
