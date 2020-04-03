/* eslint-disable @typescript-eslint/no-var-requires */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import configureStore, { history } from './redux/store';
import { register } from './serviceWorker';

const { store } = configureStore();

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

const rootEl = document.getElementById('root');

if (rootEl) {
  ReactDOM.render(<App store={store} history={history} />, rootEl);
  register();
}

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line
    if (rootEl) {
      ReactDOM.render(<NextApp store={store} />, rootEl);
    }
  });
}
