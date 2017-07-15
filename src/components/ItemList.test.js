import React from 'react';
import ReactDOM from 'react-dom';
import ItemList from './ItemList';

jest.mock('../services/TaskService', () => ({
  fetchAllTasks: () => { return [] }
}));

describe('#constructor', () => {
  it('sets the state on the initial ItemList', () => {
    let itemList = new ItemList();

    expect(itemList.state).toEqual(
      {
        selectedTask: null,
        tasks: [],
        startTime: null,
        endTime: null
      }
    );
  });
});

describe('#render', () => {
  it("doesn't blow up upon rendering", () => {
    const div = document.createElement('div');
    ReactDOM.render(<ItemList />, div);
  });
});

describe('#addTask', () => {
});
