import {appApi} from './config';

export const streamApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getStreams: build.query({
      query: () => ({
        url: '/streams/read',
        method: 'GET'
      })
    })
  })
});

export const {useGetStreamsQuery} = streamApi;
