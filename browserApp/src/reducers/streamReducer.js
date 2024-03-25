import {createSlice} from '@reduxjs/toolkit';
import {appApi} from '../services/config';

const defaultStream = {
  loadedName: null,
  loadedId: null,

  scroller: {
    limit: 5, // low for testing
    offset: 0,
  },

  lastObservedLength: 0, // for triggering queries only when the last one is complete (and has returned something new)
  lastScrolled: 0, // date-time last scrolled (for debounce)

  search: '',
};

const streamSlice = createSlice({
  name: 'stream',

  initialState: defaultStream,

  reducers: {
    incrementScroller(state, action) {
      const debounce = 1000; // time in ms

      const timeNow = new Date();
      const timeThen = new Date(state.lastScrolled);

      const currentDataLength = action.payload;

      // won't increment if within debounce period
      if ((timeNow - timeThen > debounce) && (currentDataLength > state.lastObservedLength)) {
        console.log(state.scroller.limit + state.scroller.offset);
        return {
          ...state,
          lastObservedLength: currentDataLength,
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
        lastObservedLength: defaultStream.lastObservedLength,
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
