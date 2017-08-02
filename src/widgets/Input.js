import React, { Component } from 'react';

class Input extends Component {
  constructor() {
    super();
    this.state = { value: '' };
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({value});

    this.input.focus();
  }

  handleUpdate = (e) => {
    this.setState({value: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.value === '') {
      this.props.onEmptySubmit();
    } else {
      this.setState({value: ''});
      this.props.handleSubmit(this.state.value);
    }
  }

  handleKeyDown = (e) => {
    if(e.key === 'Escape' && this.props.onEscPress) 
      this.props.onEscPress();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input 
            ref={(input) => { this.input = input }}
            onKeyDown={this.handleKeyDown}
            value={this.state.value}
            onBlur={this.props.onBlur}
            onChange={this.handleUpdate} />
        </label>
      </form>
    );
  }
}

export default Input;
