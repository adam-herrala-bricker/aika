import {appApi} from './config';

export const sliceApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getSlices: build.query({
      query: ({streamId, limit, offset}) => ({
        url: `/slices/${streamId}`,
        method: 'GET',
      }),
      providesTags: ['Slice']
    }),

    newSlice: build.mutation({
      query: ({slice, streamId}) => ({
        url: `/slices/${streamId}`,
        method: 'POST',
        body: slice
      }),
      invalidatesTags: ['Slice']
    })
  })
});

export const {useGetSlicesQuery, useNewSliceMutation} = sliceApi;
