import {createSlice} from '@reduxjs/toolkit';
import {appApi} from '../services/config';

const defaultStream = {
  loadedName: null,
  loadedId: null,

  scroller: {
    limit: 5, // low for testing
    offset: 0,
  },

  lastScrolled: 0, // date last scrolled

  search: '',
};

const streamSlice = createSlice({
  name: 'stream',

  initialState: defaultStream,

  reducers: {
    incrementScroller(state) {
      const debounce = 1000; // time in ms
      const timeNow = new Date();
      const timeThen = new Date(state.lastScrolled);

      // won't increment if within debounce period
      if (timeNow - timeThen > debounce) {
        return {
          ...state,
          scroller: {
            ...state.scroller,
            offset: state.scroller.limit + state.scroller.offset
          },
          lastScrolled: timeNow.toISOString()
        };
      }
    },

    setSearch(state, action) {
      return {
        ...state,
        search: action.payload
      };
    },

    setStream(state, action) {
      const newStream = action.payload;
      return {
        ...state,
        loadedName: newStream.name,
        loadedId: newStream.id
      };
    },

    resetScroller(state) {
      return {
        ...state,
        scroller: defaultStream.scroller
      };
    },

    resetStream() {
      return defaultStream;
    }
  }
});

export const {incrementScroller, setSearch, setStream, resetScroller, resetStream} = streamSlice.actions;

// clears the cache for this stream (used whenever switching between streams)
export const clearStreamCache = (streamId) => {
  return (dispatch) => {
    // this replaces the cache item with an empty array (if it's there)
    if (streamId) {
      dispatch(appApi.util.updateQueryData('getSlices', {streamId}, () => {return [];}));
    }
    dispatch(resetScroller());
  };
};

export default streamSlice.reducer;
