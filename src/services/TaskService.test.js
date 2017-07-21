import TaskService from './TaskService';
import {LocalStorage as NodeLocalStorage} from 'node-localstorage';
import MockDate from 'mockdate';

/* Set up localstorage in node context */
let localStorage = new NodeLocalStorage('./scratch');
window.localStorage = localStorage;

/* Clean up after node-localstorage library */
afterAll(() => {
  localStorage._deleteLocation();
});

const DEFAULT_ITEM_DATA_STRUCTURE = {
  start: null,
  end: null,
  selected: false,
  elapsedTime: 0
};

let itemName = 'foo';

describe('.add', () => {
  describe('when taskname is empty', () => {
    it('cannot add that item', () => {
      const task = TaskService.add('');
      expect(task.created).toBeFalsey;
    });

    it('has returns an object with an error message', () => {
      const task = TaskService.add('');
      expect(task.errorMessage).toEqual('Your task has to have a name!');
    });
  });
  describe('when TaskService already contains that item', () => {
    beforeEach(() => {
      const actualValue = 'bar';
      localStorage.setItem(itemName, actualValue);
    });

    it('cannot add that item', () => {
      const task = TaskService.add(itemName);
      expect(task.created).toBeFalsey;
    });

    it('cannot add that item', () => {
      const task = TaskService.add(itemName);
      expect(task.errorMessage).toEqual('That task already exists...');
    });

    it('does not reassign foo', () => {
      const unexpectedValue = 'not this';
      TaskService.add(itemName, unexpectedValue);
      expect(localStorage.getItem(itemName)).not.toEqual(unexpectedValue);
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
  it('returns those tasks from local storage', () => {
    TaskService.add(itemName);
    TaskService.add('bar');

    const tasks = TaskService.fetchAllTasks();
    expect(tasks).toEqual(expect.arrayContaining([
      Object.assign({ name: itemName }, DEFAULT_ITEM_DATA_STRUCTURE),
      Object.assign({ name: 'bar' }, DEFAULT_ITEM_DATA_STRUCTURE),
    ]));
  });

  it('returns those tasks from local storage', () => {
    const tasks = TaskService.fetchAllTasks();
    expect(tasks).toEqual([]);
  });

  afterEach(() => {
    localStorage.removeItem(itemName);
    localStorage.removeItem('bar');
    localStorage.removeItem(TaskService.taskCollectionKey);
  });
});

describe('.setAttribute', () => {
  let date;

  beforeEach(() => {
    localStorage.setItem(itemName, JSON.stringify(
      Object.assign({ name: itemName }, DEFAULT_ITEM_DATA_STRUCTURE)
    ));

    date = new Date(1988, 10, 19);
    MockDate.set(date)
  });

  it('sets the time on that item, (defaulting to Date.now)', () => {
    TaskService.setAttribute(itemName, 'start');

    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(
      Object.assign(
        {},
        DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: itemName,
          start: date.getTime()
        }
      )
    );
  });

  it('sets the passed in time on start', () => {
    TaskService.setAttribute(itemName, 'start', new Date());

    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(
      Object.assign(
        {},
        DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: itemName,
          start: date.getTime()
        }
      )
    );
  });

  it('sets the passed in time on end', () => {
    TaskService.setAttribute(itemName, 'end', new Date());

    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(
      Object.assign(
        {},
        DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: itemName,
          end: date.getTime()
        }
      )
    );
  });

  it("returns false and doesn't modify localstorage item if date is not passed in", () => {
    const setter = TaskService.setAttribute(itemName, 'end', 'foo');
    expect(setter).toEqual(false);

    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(
      Object.assign(
        {},
        DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: itemName
        }
      )
    );
  });

  afterEach(() => {
    MockDate.reset();
    localStorage.removeItem(itemName);
    localStorage.removeItem(TaskService.taskCollectionKey);
  });
});

describe('.start', () => {
  let date;

  beforeEach(() => {
    localStorage.setItem(itemName, JSON.stringify(
      Object.assign({ name: itemName }, DEFAULT_ITEM_DATA_STRUCTURE)
    ));

    date = new Date(1988, 10, 19);
    MockDate.set(date)
  });

  it('sets the start time, selected true', () => {
    TaskService.start(itemName);

    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(
      Object.assign(
        {},
        DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: itemName,
          start: date.getTime(),
          selected: true
        }
      )
    );
  });

  it('sets the end time, selected false', () => {
    const beginningDate = new Date(2017, 0, 1);
    MockDate.set(beginningDate);

    TaskService.start(itemName);

    const endingDate = new Date(2017, 0, 2);
    MockDate.set(endingDate);

    TaskService.stop(itemName);

    const elapsedTime = endingDate - beginningDate;

    let actualItem = JSON.parse(localStorage.getItem(itemName));
    expect(actualItem).toEqual(
      Object.assign(
        {},
        DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: itemName,
          elapsedTime: elapsedTime,
          start: beginningDate.getTime(),
          end: endingDate.getTime(),
          selected: false
        }
      )
    );
  });

  afterEach(() => {
    MockDate.reset();
    localStorage.removeItem(itemName);
    localStorage.removeItem(TaskService.taskCollectionKey);
  });
});

describe('.stopAllTasks', () => {
  let startDate, endDate;

  beforeEach(() => {
    startDate = new Date(1988, 10, 19);
    MockDate.set(startDate)

    TaskService.add('foo');
    TaskService.add('bar');
    TaskService.add('baz');

    TaskService.start('foo');
    TaskService.start('baz');
  });

  it('stops only selected tasks', () => {
    let getItem = (item) => { 
      return JSON.parse(localStorage.getItem(item))
    }

    expect(getItem('foo')).toEqual(
      Object.assign( {}, DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: 'foo',
          start: startDate.getTime(),
          selected: true
        }
      )
    );
    expect(getItem('bar')).toEqual(
      Object.assign( {}, DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: 'bar',
          selected: false,
          start: null
        }
      )
    );
    expect(getItem('baz')).toEqual(
      Object.assign( {}, DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: 'baz',
          selected: true,
          start: startDate.getTime()
        }
      )
    );


    endDate = new Date(1988, 10, 20);
    MockDate.set(endDate)

    TaskService.stopAllTasks();

    const elapsedTime = endDate - startDate;
    expect(getItem('foo')).toEqual(
      Object.assign( {}, DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: 'foo',
          start: startDate.getTime(),
          end: endDate.getTime(),
          elapsedTime: elapsedTime,
          selected: false
        }
      )
    );
    expect(getItem('bar')).toEqual(
      Object.assign( {}, DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: 'bar',
          selected: false,
          start: null
        }
      )
    );
    expect(getItem('baz')).toEqual(
      Object.assign( {}, DEFAULT_ITEM_DATA_STRUCTURE,
        {
          name: 'baz',
          selected: false,
          start: startDate.getTime(),
          end: endDate.getTime(),
          elapsedTime: elapsedTime
        }
      )
    );
  });
});


