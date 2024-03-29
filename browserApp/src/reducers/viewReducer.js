// app state that affects the view the app is in
import {createSlice} from '@reduxjs/toolkit';

const defaultView = {
  showSideMenu: true,
  streamSliceMain: 'slice',  // main component for StreamSliceView (other values = 'info', 'settings')
  imageRes: 'web', // other value = 'full'
  createSliceHidden: true
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

    // want the image res to persist
    resetView(state) {
      return {
        ...defaultView,
        imageRes: state.imageRes};
    },

    setCreateSliceHidden(state, action) {
      return {
        ...state,
        createSliceHidden: action.payload
      };
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
  setCreateSliceHidden,
  toggleSideMenu
} = viewSlice.actions;

export default viewSlice.reducer;
