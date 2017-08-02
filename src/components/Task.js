import React, { Component } from 'react';
import ElapsedTime from './ElapsedTime';
import Input from '../widgets/Input';
import cx from 'classnames';

class Task extends Component {
  constructor() {
    super();
    // TODO: this will eventually be set via the preferences
    this.state = {
      taskName: '',
      showPreciseTime: false,
      editingTaskName: false
    };
  }

  componentDidMount() {
    const taskName = this.props.task.name;
    this.setState({taskName});
  }

  handleMouseEnter = () => {
    this.setState({ showPreciseTime: true });
  }

  handleMouseLeave = () => {
    this.setState({ showPreciseTime: false });
  }

  handleEditButtonClick = () => {
    this.setState({ editingTaskName: true });
  }

  handleNameUpdate = (newName) => {
    const { task } = this.props;
    this.props.onTaskEditName(task.name, newName);
  }

  handleCancelNameUpdate = () => {
    this.setState({editingTaskName: false});
  }

  render() {
    const {
      task,
      onTaskChange,
      onTaskDelete
    } = this.props;

    const taskDisplay =
      this.state.editingTaskName ?
        <Input
          value={this.state.taskName} 
          onEscPress={this.handleCancelNameUpdate}
          onEmptySubmit={this.handleCancelNameUpdate}
          onBlur={this.handleCancelNameUpdate}
          handleSubmit={(value) => this.handleNameUpdate(value) } /> 
      : 
        <span
          className="title-display"
          onClick={() => {this.setState({editingTaskName: true})}}>
          {task.name}
        </span>;

    const editButtonClassName = cx({
      'hiding-button': true,
      'fa': true,
      'fa-pencil': true,
      'fa-pencil-square-o': true,
      'hidden': this.state.editingTaskName
    });

    const deleteButtonClassName = cx({
      'hiding-button': true,
      'fa': true,
      'fa-ban': true,
      'hidden': this.state.editingTaskName
    });

    return (
      <div className="row item-row">
        <span 
          className="title-wrapper"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}>
          <span className="title">
            {taskDisplay}
            <i
              className={editButtonClassName}
              onClick={this.handleEditButtonClick} />
            <i
              className={deleteButtonClassName}
              onClick={ () => { onTaskDelete(task.name) } } />
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
            onChange={onTaskChange}
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
