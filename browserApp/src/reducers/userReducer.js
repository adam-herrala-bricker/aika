import {createSlice} from '@reduxjs/toolkit';
import {clearSlice} from './sliceReducer';
import {resetStream} from './streamReducer';
import {resetView} from './viewReducer';
import {appApi} from '../services/config';

const defaultUser = {
  username: 'guest',
  userId: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',

  initialState: {
    ...defaultUser
  },

  reducers: {
    setUser(state, action) {
      const thisUser = action.payload;
      const {username, id, token} = thisUser;

      // add user to local storage
      window.localStorage.setItem('aikaUser', JSON.stringify(thisUser));

      return {
        ...state,
        username : username,
        userId: id,
        token: token,
      };
    },

    clearUser() {
      window.localStorage.removeItem('aikaUser');
      return {...defaultUser};
    }
  }
});

export const {clearUser, setUser} = userSlice.actions;

export const logOut = (token) => {
  return async (dispatch) => {
    const response = await dispatch(appApi.endpoints.logoutUser.initiate({token}));
    if (response.error) {
      console.log('something went wrong');
    }
    // just clear everything
    dispatch(clearUser());
    dispatch(clearSlice());
    dispatch(resetStream());
    dispatch(resetView());
    await dispatch(appApi.util.resetApiState());
  };
};

export default userSlice.reducer;
