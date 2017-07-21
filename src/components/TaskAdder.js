import React, { Component } from 'react';

class TaskAdder extends Component {
  constructor() {
    super();
    this.state = { value: '' };
  }

  handleUpdate = (e) => {
    this.setState({value: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.value === '') return;
    this.setState({value: ''});
    this.props.addTask(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input value={this.state.value} onChange={this.handleUpdate} />
          <input type="submit" value="Add Item" />
        </label>
      </form>
    );
  }
}

export default TaskAdder;
