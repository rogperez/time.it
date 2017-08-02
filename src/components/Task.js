import React, { Component } from 'react';
import ElapsedTime from './ElapsedTime';

class Task extends Component {
  constructor() {
    super();
    // TODO: this will eventually be set via the preferences
    this.state = {
      showPreciseTime: false
    };
  }

  handleMouseEnter = () => {
    this.setState({ showPreciseTime: true });
  }

  handleMouseLeave = () => {
    this.setState({ showPreciseTime: false });
  }

  render() {
    const {
      task,
      handleTaskChange,
      handleTaskDelete,
      handleTaskEdit
    } = this.props;

    return (
      <div className="row item-row">
        <span 
          className="title-wrapper"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}>
          <span className="title">
            {task.name}
            <i
              className="hiding-button fa fa-pencil-square-o"
              onClick={ () => { handleTaskEdit(task.name) } } />
            <i
              className="hiding-button fa fa-ban"
              onClick={ () => { handleTaskDelete(task.name) } } />
          </span>
          <ElapsedTime 
            showPreciseTime={this.state.showPreciseTime}
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
