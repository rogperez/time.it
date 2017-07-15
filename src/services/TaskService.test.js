import TaskService from './TaskService';
import {LocalStorage as NodeLocalStorage} from 'node-localstorage';

/* Set up localstorage in node context */
let localStorage = new NodeLocalStorage('./scratch');
window.localStorage = localStorage;

/* Clean up after node-localstorage library */
afterAll(() => {
  localStorage._deleteLocation();
});

const DEFAULT_ITEM_DATA_STRUCTURE = {
  totalElapsedTime: 0
};

let itemName = 'foo';

describe('.add', () => {
  describe('when TaskService already contains that item', () => {
    beforeEach(() => {
      const actualValue = 'bar';
      localStorage.setItem(itemName, actualValue);
    });

    it('cannot add that item', () => {
      expect(TaskService.add(itemName)).toBeFalsey;
    });

    it('does not reassign foo', () => {
      const unepectedValue = 'not this';
      TaskService.add(itemName, unepectedValue);
      expect(localStorage.getItem(itemName)).not.toEqual(unepectedValue);
    });
  });

  describe('when TaskService does not contain that item', () => {
    it('adds it to the time-it-tasks array', () => {
      TaskService.add(itemName);
      TaskService.add('bar');
      const allTasksFromLocalStorage = 
        JSON.parse(
          localStorage.getItem(TaskService.taskCollectionKey)
        );
      expect(allTasksFromLocalStorage).toEqual(
        expect.arrayContaining([itemName, 'bar'])
      );
    });

    it('adds the default item to localStorage', () => {
      TaskService.add(itemName);
      let itemFromTaskService = JSON.parse(
        localStorage.getItem(itemName)
      );

      const expected = Object.assign({ name: itemName }, DEFAULT_ITEM_DATA_STRUCTURE);
      expect(itemFromTaskService).toEqual(expected);
    });

    it('returns the default item', () => {
      expect(TaskService.add(itemName)).
        toEqual(
          Object.assign(
            { name: itemName },
            DEFAULT_ITEM_DATA_STRUCTURE
          )
        );
    });
  });

  afterEach(() => {
    localStorage.removeItem(itemName);
    localStorage.removeItem(TaskService.taskCollectionKey);
  });
});

describe('.setElapsedTime', () => {
  let time = 25;
  let expectedItem = Object.assign(
    {},
    DEFAULT_ITEM_DATA_STRUCTURE,
    { 
      totalElapsedTime: time,
      name: itemName
    }
  );

  beforeEach(() => {
    localStorage.setItem(itemName, JSON.stringify(
      Object.assign({ name: itemName }, DEFAULT_ITEM_DATA_STRUCTURE)
    ));
  });

  it('sets the time on that item', () => {
    TaskService.setElapsedTime(itemName, time);
    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(expectedItem);
  });

  it('returns the item data', () => {
    expect(TaskService.setElapsedTime(itemName, time)).toEqual(expectedItem);
  });

  afterEach(() => {
    localStorage.removeItem(itemName);
    localStorage.removeItem(TaskService.taskCollectionKey);
  });
});

describe('.remove', () => {
  beforeEach(() => {
    localStorage.setItem(itemName, 'bar');
  });

  it('removes the item from localstorage', () => {
    expect(localStorage.getItem(itemName)).toEqual('bar');
    TaskService.remove(itemName);
    expect(localStorage.getItem(itemName)).toEqual(null);
  });

  it('removes the item from the all tasks array', () => {
    TaskService.add('hey');
    TaskService.add('ho');

    const allTasksArray = () => {
      return JSON.parse(
        localStorage.getItem(TaskService.taskCollectionKey)
      );
    };

    // ensure the tasks were added
    expect(allTasksArray())
      .toEqual(expect.arrayContaining(['hey', 'ho']));

    TaskService.remove('hey')

    expect(allTasksArray())
      .toEqual(expect.arrayContaining(['ho']));

    expect(allTasksArray())
      .not.toEqual(expect.arrayContaining(['hey']));
  });

  it('returns true', () => {
    expect(TaskService.remove(itemName)).toEqual(true);
  });

  afterEach(() => {
    localStorage.removeItem(itemName);
    localStorage.removeItem('bar');
    localStorage.removeItem(TaskService.taskCollectionKey);
  });
});

describe('.fetchAllTasks', () => {
  beforeEach(() => {
    TaskService.add(itemName);
    TaskService.add('bar');
  });

  it('returns those tasks from local storage', () => {
    const tasks = TaskService.fetchAllTasks();
    expect(tasks).toEqual(expect.arrayContaining([
      { name: itemName, totalElapsedTime: 0 },
      { name: 'bar', totalElapsedTime: 0 }
    ]));
  });
});


