import React, { Component } from 'react';

class ItemList extends Component {
  constructor() {
    super();
    this.state = {
      selectedTask: 'task1'
    };
  }

  handleTaskChange = (changeEvent) => {
    this.setState({
      selectedTask: changeEvent.target.value
    });
  }

  render() {
    return (
      <div>
        <div>
          <label>
            <input type="radio" value="task1" 
              onChange={this.handleTaskChange}
              checked={this.state.selectedTask==='task1'} />
            Task1
          </label>
        </div>
        <div>
          <label>
            <input type="radio" value="task2"
              onChange={this.handleTaskChange}
              checked={this.state.selectedTask==='task2'} />
            Task2
          </label>
        </div>
        <div>
          <label>
            <input type="radio" value="task3"
              onChange={this.handleTaskChange}
              checked={this.state.selectedTask==='task3'} />
            Task3
          </label>
        </div>
      </div>
    );
  }
}

export default ItemList;
