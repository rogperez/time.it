import React, { Component } from 'react';
import TaskAdder from './TaskAdder';
import TaskService from '../services/TaskService';

class ItemList extends Component {
  constructor() {
    super();
    this.state = {
      selectedTask: null,
      tasks: TaskService.fetchAllTasks(),
      startTime: null,
      endTime: null
    }
  }

  addTask = (taskName) => {
    const task = TaskService.add(taskName);
    if(task) {
      let newTasks = this.state.tasks;
      newTasks.push(task);
      this.setState({ tasks: newTasks });
    }
  }

  handleTaskDelete = (event) => {
    event.preventDefault();
    this.clearTasks();
  }

  handleTaskChange = (event) => {
    let newState = { selectedTask: event.target.value };

    if (this.state.startTime) {
      const  totalElapsedTime = parseInt((new Date() - this.state.startTime)/1000, 10);
      let totalElapsed = 0;

      newState.tasks = this.state.tasks.map((task) => {
        if (task.name === this.state.selectedTask) {
          totalElapsed = task.totalElapsedTime + totalElapsedTime
          return { name: task.name, totalElapsedTime: totalElapsed }
        } else return task
      });
    }

    newState.startTime = new Date();

    this.setState(newState);
  }

  clearTasks = () => {
    this.setState({selectedTask: null});
  }

  render() {
    const tasks = this.state.tasks.map((task) =>
      <div key={task.name}>
        <label>
          <input type="radio" value={task.name} 
            onChange={this.handleTaskChange}
            checked={this.state.selectedTask===task.name} />
          {task.name}
        </label>
      </div>
    );

    return (
      <div>
        <TaskAdder addTask={this.addTask} />
        <div>
          {tasks}
        </div>
        <div>
          <button onClick={this.handleTaskDelete}>Clear Events</button>
        </div>
      </div>
    );
  }
}

export default ItemList;
