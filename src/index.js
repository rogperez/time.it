import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './init/registerServiceWorker';
import './styles/index.css';
import 'font-awesome/css/font-awesome.css';

if ("undefined" !== typeof window.require) {
  window.electronEnvironment = true;
} else window.electronEnvironment = false;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
