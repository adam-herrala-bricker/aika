// app state that affects the view the app is in
import {createSlice} from '@reduxjs/toolkit';

const defaultView = {
  showSideMenu : true
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

    toggleSideMenu(state) {
      return {
        ...state,
        showSideMenu: !state.showSideMenu};
    }
  }
});

export const {closeSideMenu, toggleSideMenu} = viewSlice.actions;

export default viewSlice.reducer;
