import {createSlice} from '@reduxjs/toolkit';

const defaultStream = {
  loadedName: null,
  loadedId: null
};

const streamSlice = createSlice({
  name: 'stream',

  initialState: defaultStream,

  reducers: {
    setStream(state, action) {
      const newStream = action.payload;
      return {
        ...state,
        loadedName: newStream.name,
        loadedId: newStream.id
      };
    },

    resetStream() {
      return defaultStream;
    }
  }
});

export const {setStream, resetStream} = streamSlice.actions;

export default streamSlice.reducer;
