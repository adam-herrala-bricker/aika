import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {appApi} from './services/config';
import registrationReducer from './reducers/registrationReducer';
import sliceReducer from './reducers/sliceReducer';
import streamReducer from './reducers/streamReducer';
import userReducer from './reducers/userReducer';
import viewReducer from './reducers/viewReducer';

const store = configureStore({
  reducer: {
    registration: registrationReducer,
    slice: sliceReducer,
    stream: streamReducer,
    user: userReducer,
    view: viewReducer,
    [appApi.reducerPath]: appApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware)

});

setupListeners(store.dispatch);

export default store;
