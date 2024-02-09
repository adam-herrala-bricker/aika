// app state that affects the view the app is in
import {createSlice} from '@reduxjs/toolkit';

const defaultView = {
  showSideMenu: true,
  showLoadMore: true,
  cachedDataLength: null // used to determined whether to show load more
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

    resetScrollView(state) {
      return {
        ...state,
        showLoadMore: defaultView.showLoadMore,
        cachedDataLength: defaultView.cachedDataLength
      };
    },

    setCachedDataLength(state, action) {
      return {
        ...state,
        cachedDataLength: action.payload
      };
    },

    setShowLoadMore(state, action) {
      return {
        ...state,
        showLoadMore: action.payload
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
  resetScrollView,
  setCachedDataLength,
  setShowLoadMore,
  toggleSideMenu
} = viewSlice.actions;

export default viewSlice.reducer;
