// app state that affects the view the app is in
import {createSlice} from '@reduxjs/toolkit';

const defaultView = {
  showSideMenu: true,
  // main component for StreamSliceView (other value = 'info')
  streamSliceMain: 'slice',
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

    setStreamSliceMain(state, action) {
      return {
        ...state,
        streamSliceMain: action.payload
      };
    },

    toggleSideMenu(state) {
      return {
        ...state,
        showSideMenu: !state.showSideMenu};
    }
  }
});

export const {
  closeSideMenu,
  resetView,
  setStreamSliceMain,
  toggleSideMenu
} = viewSlice.actions;

export default viewSlice.reducer;
