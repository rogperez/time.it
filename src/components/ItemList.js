import React, { Component } from 'react';
import TaskAdder from './TaskAdder';
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
    if(task) {
      let newTasks = this.state.tasks;
      newTasks.push(task);
      this.setState({ tasks: newTasks });
    } else alert(`${taskName} has already been added!`);
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
      <div key={task.name} className="row item-row">
        <span className="title">{task.name}</span>
        <span className="filler"></span>
        <div className="fancy-checkbox">
          <input
            id={task.name}
            value={task.name}
            type="checkbox"
            onChange={this.handleTaskChange}
            defaultChecked={task.selected} />
          <label htmlFor={task.name}>
            <span className="spinner"></span>
            <span className="text"></span>
          </label>
        </div>
      </div>
    );

    return (
      <div>
        <TaskAdder addTask={this.addTask} />
        <div>
          {tasks}
        </div>
        <div>
          <button onClick={this.handleStopAll}>Stop All Items</button>
        </div>
      </div>
    );
  }
}

export default ItemList;
