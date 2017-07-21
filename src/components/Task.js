import React, { Component } from 'react';
import ElapsedTime from './ElapsedTime';

class Task extends Component {
  render() {
    const { task, handleTaskChange } = this.props
    return (
      <div className="row item-row">
        <span className="title-wrapper">
          <span className="title">{task.name}</span>
          <ElapsedTime 
            elapsedTime={task.elapsedTime} />
        </span>
        <span className="filler"></span>
        <div className="fancy-checkbox">
          <input
            id={task.name}
            value={task.name}
            type="checkbox"
            onChange={handleTaskChange}
            checked={task.selected} />
          <label htmlFor={task.name}>
            <span className="spinner"></span>
            <span className="text"></span>
          </label>
        </div>
      </div>
    );
  }
}

export default Task;
