// app state that affects the view the app is in
import {createSlice} from '@reduxjs/toolkit';

const defaultView = {
  showSideMenu: true,
  streamSliceMain: 'slice',  // main component for StreamSliceView (other values = 'info', 'settings')
  imageRes: 'web', // other value = 'full'
  createSliceHidden: true,

  appWidth: window.innerWidth, // actual width of app
  mobileBreakpoint: 600 // breakpoint width in px
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

    // want the app width and image res to persist
    resetView(state) {
      return {
        ...defaultView,
        appWidth: state.appWidth,
        imageRes: state.imageRes};
    },

    setAppWidth(state, action) {
      return {
        ...state,
        appWidth: action.payload
      };
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
  setAppWidth,
  setImageRes,
  setStreamSliceMain,
  setCreateSliceHidden,
  toggleSideMenu
} = viewSlice.actions;

export default viewSlice.reducer;
