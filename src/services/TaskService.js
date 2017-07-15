import AdditionalUtils from '../util/AdditionalUtils';

const DEFAULT_ITEM_DATA = {
  totalElapsedTime: 0
};

const taskCollectionKey = 
  AdditionalUtils.stringToHashCode('Kanye West');

const addToTaskArray = (itemName) => {
  const allTasks = 
    JSON.parse(
      localStorage.getItem(
        taskCollectionKey
      ) || '[]'
    );

  allTasks.push(itemName);

  localStorage.setItem(
    taskCollectionKey,
    JSON.stringify(allTasks)
  );
};

const removeFromTaskArray = (itemName) => {
  const allTasks = 
    JSON.parse(
      localStorage.getItem(
        taskCollectionKey
      ) || '[]'
    );

  const filteredTasks = 
    allTasks.filter(task => task !== itemName)

  localStorage.setItem(
    taskCollectionKey,
    JSON.stringify(filteredTasks)
  );
}

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

  setElapsedTime: (itemName, time) => {
    const itemFromStorage = JSON.parse(localStorage.getItem(itemName));
    itemFromStorage.totalElapsedTime = time;
    localStorage.setItem(itemName, JSON.stringify(itemFromStorage));
    return itemFromStorage;
  },

  remove: (itemName) => {
    localStorage.removeItem(itemName);
    removeFromTaskArray(itemName);
    return true;
  },

  fetchAllTasks: () => {
    const result = [];
    const allTasks = JSON.parse(localStorage.getItem(taskCollectionKey));

    allTasks.forEach((task) => {
      result.push(
        JSON.parse(
          localStorage.getItem(task)
        )
      );
    });

    return result;
  }
}
