const setSpinning = () => {
  if (window.electronEnvironment) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('menubar-spin'); // eslint-disable-line no-undef
  }
};

const setWaiting = () => {
  if (window.electronEnvironment) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('menubar-wait'); // eslint-disable-line no-undef
  }
};

export default {
  setSelectedTasks: (count) => {
    if(count) {
      setSpinning();
    } else {
      setWaiting();
    }
  }
}
