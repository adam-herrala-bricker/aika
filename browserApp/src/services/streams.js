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

    // for the user's permissions on that stream
    getMyPermissions: build.query({
      query: (streamId) => ({
        url: `/streams/my-permissions/${streamId}`,
        method: 'GET'
      }),
      providesTags: ['Permission']
    }),

    // all users' permissions for that stream
    // (only works for stream admins)
    getAllPermissions: build.query({
      query: (streamId) => ({
        url: `/streams/all-permissions/${streamId}`,
        method: 'GET'
      }),
      providesTags: ['Permission']
    }),

    newStream: build.mutation({
      query: (name) => ({
        url: '/streams',
        method: 'POST',
        body: name
      }),
      invalidatesTags: ['Stream']
    }),

    deleteStream: build.mutation({
      query: (streamId) => ({
        url: `/streams/${streamId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Stream']
    })
  })
});

export const {
  useDeleteStreamMutation,
  useGetStreamsQuery,
  useGetAllPermissionsQuery,
  useGetMyPermissionsQuery,
  useNewStreamMutation
} = streamApi;
