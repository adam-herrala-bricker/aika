import {configureStore} from '@reduxjs/toolkit';
import lanReducer from './reducers/lanReducer';

const store = configureStore({
  reducer: {
    lan: lanReducer
  }
});

export default store;
