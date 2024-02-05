// needed to work on some browsers
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import store from './store';

import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </Provider>
);
