import {createSlice} from '@reduxjs/toolkit';
import {clearSlice} from './sliceReducer';
import {resetStream} from './streamReducer';
import {resetView} from './viewReducer';
import {appApi} from '../services/config';
import {howLongAgoInMinutes} from '../util/helpers';

const tokenLifeInMinutes = 10000; // slightly under one week;

const defaultUser = {
  username: 'guest',
  userId: null,
  token: null,
  tokenCreatedAt: null,
  minutesUntilTokenExpires: tokenLifeInMinutes
};

const userSlice = createSlice({
  name: 'user',

  initialState: {
    ...defaultUser
  },

  reducers: {
    setUser(state, action) {
      const thisUser = action.payload;
      const {username, id, token, tokenCreatedAt} = thisUser;

      // add user to local storage
      window.localStorage.setItem('aikaUser', JSON.stringify(thisUser));

      return {
        ...state,
        username: username,
        userId: id,
        token: token,
        tokenCreatedAt: tokenCreatedAt,
        minutesUntilTokenExpires: tokenLifeInMinutes - howLongAgoInMinutes(tokenCreatedAt)
      };
    },

    clearUser() {
      window.localStorage.removeItem('aikaUser');
      return {...defaultUser};
    },

    updateTokenExpiry(state) {
      if (state.username === 'guest') {
        return state;
      }
      // only update expiry if user loaded
      return {
        ...state,
        minutesUntilTokenExpires: tokenLifeInMinutes - howLongAgoInMinutes(state.tokenCreatedAt)
      };
    }
  }
});

export const {clearUser, setUser, updateTokenExpiry} = userSlice.actions;

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

export const manageAutoLogout = (minutesUntilTokenExpires) => {
  return (dispatch) => {
    const timeoutRate = minutesUntilTokenExpires > 3 ? 60*1000 : 1000;
    if (minutesUntilTokenExpires <= .05) { // just before 0
      dispatch(logOut());
    }

    const thisTimeout = setTimeout(() => {
      dispatch(updateTokenExpiry());
    }, timeoutRate);

    return thisTimeout;
  };
};

export default userSlice.reducer;
