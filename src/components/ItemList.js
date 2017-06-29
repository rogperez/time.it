import React, { Component } from 'react';
import TaskAdder from './TaskAdder';

class ItemList extends Component {
  constructor() {
    super();
    this.state = {
      selectedTask: null,
      tasks: [{name: "foo", elapsedTime: 0}],
      logs: [],
      startTime: null,
      endTime: null
    };
  }

  addTask = (taskName) => {
    let newTasks = this.state.tasks;
    newTasks.push({name: taskName, elapsedTime: 0});
    this.setState({
      tasks: newTasks
    });
  }

  handleTaskChange = (changeEvent) => {
    let newState = { selectedTask: changeEvent.target.value };

    if (this.state.startTime) {
      const  elapsedTime = parseInt((new Date() - this.state.startTime)/1000, 10);
      let totalElapsed = 0;

      newState.tasks = this.state.tasks.map((task) => {
        if (task.name === this.state.selectedTask) {
          totalElapsed = task.elapsedTime + elapsedTime
          return { name: task.name, elapsedTime: totalElapsed }
        } else return task
      });

      newState.logs = this.state.logs;
      newState.logs.push(
        `${this.state.selectedTask}: current elapsed ${elapsedTime}, total elapsed ${totalElapsed}`
      );
    }

    newState.startTime = new Date();

    this.setState(newState);
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

    const logs = this.state.logs.map((log) =>
      <div key={log}>
        {log}
      </div>
    );

    return (
      <div>
        <TaskAdder addTask={this.addTask} />
        <div>
          {tasks}
        </div>
        <div>
          {logs}
        </div>
      </div>
    );
  }
}

export default ItemList;
