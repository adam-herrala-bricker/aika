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
  strand: {
    id: null,
    name: null,
    createdAt: null,
    updatedAt: null
  },
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

      // won't increment if within debounce period or if last query didn't return anything new
      if ((timeNow - timeThen > debounce) && (currentDataLength > state.lastObservedLength)) {
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

    setStrand(state, action) {
      return {
        ...state,
        strand: action.payload
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

    resetScroller(state, action) {
      const holdStrand = action.payload;

      return {
        ...state,
        lastObservedLength: defaultStream.lastObservedLength,
        scroller: defaultStream.scroller,
        strand: holdStrand ? state.strand : defaultStream.strand
      };
    },

    resetStream() {
      return defaultStream;
    }
  }
});

export const {incrementScroller, setSearch, setStrand, setStream, resetScroller, resetStream} = streamSlice.actions;

// clears the cache for this stream (used whenever switching between streams)
// holdStrand tells it to preserve the strand through clearing the cache
export const clearStreamCache = (streamId, holdStrand = false) => {
  return (dispatch) => {
    // this replaces the cache item with an empty array (if it's there)
    if (streamId) {
      dispatch(appApi.util.updateQueryData('getSlices', {streamId}, () => {return [];}));
    }
    dispatch(resetScroller(holdStrand));
  };
};

export default streamSlice.reducer;
