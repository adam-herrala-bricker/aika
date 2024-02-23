// used to manage state when sharing stream with a new user
import {createSlice} from '@reduxjs/toolkit';

const defaultSharing = {
  read: true,
  write: false,
  deleteOwn: false,
  deleteAll: false,
  admin: false,
  username: ''
};

const sharingSlice = createSlice({
  name: 'sharing',

  initialState: defaultSharing,

  reducers: {
    resetSharing() {
      return defaultSharing;
    },

    setSharing(state, action) {
      const thisPermission = action.payload;
      return {
        ...state,
        ...thisPermission
      };
    }
  }
});

export const {resetSharing, setSharing} = sharingSlice.actions;

export default sharingSlice.reducer;

