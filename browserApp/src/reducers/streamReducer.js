import {createSlice} from '@reduxjs/toolkit';
import {appApi} from '../services/config';

const defaultStream = {
  loadedName: null,
  loadedId: null,

  scroller: {
    limit: 5, // low for testing
    offset: 0,
  },
};

const streamSlice = createSlice({
  name: 'stream',

  initialState: defaultStream,

  reducers: {
    incrementScroller(state) {
      return {
        ...state,
        scroller: {
          ...state.scroller,
          offset: state.scroller.limit + state.scroller.offset
        }
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

export const {incrementScroller, setStream, resetScroller, resetStream} = streamSlice.actions;

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
