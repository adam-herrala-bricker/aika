// app state that affects the view the app is in
import {createSlice} from '@reduxjs/toolkit';

const defaultView = {
  showSideMenu: true,
  streamSliceMain: 'slice',  // main component for StreamSliceView (other values = 'info', 'settings')
  imageRes: 'web' // other value = 'full'
};

const viewSlice = createSlice({
  name: 'view',

  initialState: defaultView,

  reducers: {
    closeSideMenu(state) {
      return {
        ...state,
        showSideMenu: false
      };
    },

    resetView() {
      return defaultView;
    },

    setImageRes(state, action) {
      return {
        ...state,
        imageRes: action.payload
      };
    },

    setStreamSliceMain(state, action) {
      return {
        ...state,
        streamSliceMain: action.payload,
        showSideMenu: false
      };
    },

    toggleSideMenu(state) {
      return {
        ...state,
        showSideMenu: !state.showSideMenu};
    },
  }
});

export const {
  closeSideMenu,
  resetView,
  setImageRes,
  setStreamSliceMain,
  toggleSideMenu
} = viewSlice.actions;

export default viewSlice.reducer;
