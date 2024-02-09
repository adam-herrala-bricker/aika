import {appApi} from './config';

export const sliceApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getSlices: build.query({
      query: ({streamId, limit, offset}) => ({
        url: `/slices/view/${streamId}`,
        method: 'POST',
        body: {limit, offset}
      }),

      // modifies the cache key so it's only the streamId, not limit or offset
      // (the cache key is based on all args passed to the query)
      serializeQueryArgs: ({queryArgs}) => {
        const newQueryArgs = queryArgs.streamId;
        return newQueryArgs;
      },

      // merges new response data into cache (it's replaced by default)
      merge: (currentCacheData, responseData) => {
        currentCacheData.push(...responseData);
      },

      // forces a refetch when the args change
      forceRefetch: (currentArgs, previousArgs) => {
        return currentArgs !== previousArgs;
      },

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
