import React, { Component } from 'react';
import TaskAdder from './TaskAdder';
import TaskService from '../services/TaskService';

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
      <div key={task.name}>
        <label>
          <input type="checkbox" value={task.name} 
            onChange={this.handleTaskChange}
            checked={task.selected} />
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
          <button onClick={this.handleTaskDelete}>Stop All Items</button>
        </div>
      </div>
    );
  }
}

export default ItemList;
