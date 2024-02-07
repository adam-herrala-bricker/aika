import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {appApi} from './services/config';
import registrationReducer from './reducers/registrationReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    registration: registrationReducer,
    user: userReducer,
    [appApi.reducerPath]: appApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware)

});

setupListeners(store.dispatch);

export default store;
