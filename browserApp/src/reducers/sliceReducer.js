// similar to registration reducer, this manages the state when creating a new slice
import {createSlice} from '@reduxjs/toolkit';

const defaultSlice = {
  title: '',
  text: '',
  isMilestone: false,
  isPublic: false
};

const sliceSlice = createSlice({
  name: 'slice',

  initialState: defaultSlice,

  reducers: {
    clearSlice() {
      return defaultSlice;
    },

    updateSlice(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const {clearSlice, updateSlice} = sliceSlice.actions;

export default sliceSlice.reducer;
