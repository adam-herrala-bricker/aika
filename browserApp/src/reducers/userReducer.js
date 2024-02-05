import {createSlice} from '@reduxjs/toolkit';

const defaultUser = {
  username: 'guest',
  userId: 'null',
  token: 'null',
};

const userSlice = createSlice({
  name: 'user',

  initialState: {
    ...defaultUser
  },

  reducers: {
    setUser(state, action) {
      const {username, id, token} = action.payload;
      console.log(username);
      return {
        ...state,
        username : username,
        userId: id,
        token: token,
      };
    }
  }
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;
