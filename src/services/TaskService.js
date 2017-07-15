import AdditionalUtils from '../util/AdditionalUtils';

const DEFAULT_ITEM_DATA = {
  elapsedTime: 0,
  start: null,
  end: null,
  selected: false
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
    itemFromStorage[attribute] = value.getTime();
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

export default {
  taskCollectionKey,

  add: (itemName) => {
    if(itemName === '' || localStorage.getItem(itemName)) return false;

    localStorage.setItem(itemName, JSON.stringify(
      Object.assign({ name: itemName }, DEFAULT_ITEM_DATA)
    ));
    addToTaskArray(itemName);

    return Object.assign({ name: itemName }, DEFAULT_ITEM_DATA);
  },

  remove: (itemName) => {
    localStorage.removeItem(itemName);
    removeFromTaskArray(itemName);
    return true;
  },

  fetchAllTasks: () => {
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
  },

  setAttribute,

  start: (itemName) => {
    setAttribute(itemName, 'selected', true);
    return setAttribute(itemName, 'start');
  },

  stop: (itemName) => {
    setAttribute(itemName, 'selected', false);
    const item = setAttribute(itemName, 'end');
    return setAttribute(
      itemName,
      'elapsedTime',
      item.elapsedTime + item.end - item.start
    )
  } 
}
