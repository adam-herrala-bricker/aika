import {appApi} from './config';

export const streamApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getStreams: build.query({
      query: () => ({
        url: '/streams/read',
        method: 'GET',
      }),
      providesTags: ['Stream']
    }),

    newStream: build.mutation({
      query: (name) => ({
        url: '/streams',
        method: 'POST',
        body: name
      }),
      invalidatesTags: ['Stream']
    })
  })
});

export const {
  useGetStreamsQuery,
  useNewStreamMutation
} = streamApi;
