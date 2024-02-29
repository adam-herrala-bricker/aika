// similar to registration reducer, this manages the state when creating a new slice
import {createSlice} from '@reduxjs/toolkit';

const defaultSlice = {
  title: '',
  text: '',
  imageUrl: '',
  isMilestone: false,
  isPublic: false,
};

const sliceSlice = createSlice({
  name: 'slice',

  initialState: defaultSlice,

  reducers: {
    clearSlice() {
      return defaultSlice;
    },

    clearImage(state) {
      // this frees up memory
      URL.revokeObjectURL(state.imageUrl);

      return {
        ...state,
        imageUrl: defaultSlice.imageUrl
      };
    },

    updateSlice(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const {clearImage, clearSlice, updateSlice} = sliceSlice.actions;

export default sliceSlice.reducer;
