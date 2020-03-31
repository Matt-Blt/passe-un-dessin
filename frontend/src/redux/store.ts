import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import reducer from './reducers';

export const history = createBrowserHistory();

export default function buildStore(preloadedState = {}) {
  const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware(),
    reducer,
    preloadedState,
  });

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(() => store.replaceReducer(reducer));
    });
  }

  return { store };
}
