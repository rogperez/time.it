import AdditionalUtils from '../util/AdditionalUtils';
import MenubarService from './MenubarService';

const DEFAULT_ITEM_DATA = {
  elapsedTime: 0,
  start: null,
  end: null,
  selected: false
};

const createErrorObject = (errorMessage) => {
  return { created: false, errorMessage };
};

const taskCollectionKey =
  AdditionalUtils.stringToHashCode('Kanye West');

const getAllTasks = () => {
  return JSON.parse(
    localStorage.getItem(
      taskCollectionKey
    ) || '[]'
  );
};

const addToTaskArray = (itemName) => {
  const allTasks = getAllTasks();
  allTasks.push(itemName);
  resetAllTasksArray(allTasks);
};

const resetAllTasksArray = (allTasks) => {
  localStorage.setItem(
    taskCollectionKey,
    JSON.stringify(allTasks)
  );
};

const removeFromTaskArray = (itemName) => {
  const allTasks = getAllTasks();

  const filteredTasks =
    allTasks.filter(task => task !== itemName)

  localStorage.setItem(
    taskCollectionKey,
    JSON.stringify(filteredTasks)
  );
}

const setAttribute = (itemName, attribute, value=new Date()) => {
  const itemFromStorage = getItemFromStorage(itemName);

  if(['start', 'end'].includes(attribute)) {
    if(!(value instanceof Date)) {
      console.error('Date was not passed in. Cannot set this date');
      return false;
    }

    if('start' === attribute) {
      // TODO: fix this hack. Makes start time always seem like it's the very first
      // time they ever started the timer.
      itemFromStorage[attribute] = new Date().getTime() - itemFromStorage.elapsedTime;
    } else if ('end' === attribute) {
      itemFromStorage[attribute] = value.getTime();
    }
  } else {
    itemFromStorage[attribute] = value;
  }


  localStorage.setItem(itemName, JSON.stringify(itemFromStorage));
  return itemFromStorage;
};

const getItemFromStorage = (itemName) => {
  return JSON.parse(
    localStorage.getItem(itemName)
  );
};

const refreshItemTime = (itemName) => {
  const item = getItemFromStorage(itemName);
  return setAttribute(
    itemName,
    'elapsedTime',
    new Date().getTime() - item.start
  )
}

const stop = (itemName) => {
  setAttribute(itemName, 'selected', false);
  sendStatsToMenubar();
  const item = setAttribute(itemName, 'end');
}

const start = (itemName) => {
  setAttribute(itemName, 'selected', true);
  sendStatsToMenubar();
  return setAttribute(itemName, 'start');
}

const sendStatsToMenubar = () => {
  let activeTasks = fetchAllTasks()
    .filter(task => task.selected)
    .length;

  MenubarService.setSelectedTasks(activeTasks);
}

const fetchAllTasks = () => {
  const result = [];
  const allTasks = JSON.parse(localStorage.getItem(taskCollectionKey)) || [];

  allTasks.forEach((task) => {
    result.push(
      JSON.parse(
        localStorage.getItem(task)
      )
    );
  });

  return result;
};

const refreshTaskTime = (itemName) => {
  if(getItemFromStorage(itemName).start === null) {
    return false;
  }

  if(getItemFromStorage(itemName).selected) {
    refreshItemTime(itemName);
  } else {
    return false;
  }
};

export default {
  taskCollectionKey,

  start,

  fetchAllTasks,

  setAttribute,

  stop,

  refreshTaskTime,

  add: (itemName) => {
    if(itemName === '') {
      return createErrorObject('Your task has to have a name!');
    }
    if(localStorage.getItem(itemName)) {
      return createErrorObject('That task already exists...');
    }
    localStorage.setItem(itemName, JSON.stringify(
      Object.assign({ name: itemName }, DEFAULT_ITEM_DATA)
    ));
    addToTaskArray(itemName);

    return Object.assign({ name: itemName, created: true }, DEFAULT_ITEM_DATA);
  },

  remove: (itemName) => {
    localStorage.removeItem(itemName);
    removeFromTaskArray(itemName);
    return true;
  },

  stopAllTasks: () => {
    const allTasks = fetchAllTasks();
    allTasks
      .filter(task => task.selected)
      .forEach(task => stop(task.name));
  },

  refreshAllTasks: () => {
    fetchAllTasks().forEach(task => refreshTaskTime(task.name));
  },

  rename: (itemName, newName) => {
    const allTasks = JSON.parse(localStorage.getItem(
      taskCollectionKey
    ));

    if(allTasks.indexOf(newName) >= 0) return false;

    const indexOfTask = allTasks.indexOf(itemName);
    allTasks[indexOfTask] = newName;
    resetAllTasksArray(allTasks);

    let oldItem = JSON.parse(localStorage.getItem(itemName));
    oldItem.name = newName;
    localStorage.removeItem(itemName);
    localStorage.setItem(newName, JSON.stringify(oldItem));

    return true;
  }
}
