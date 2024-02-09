import {appApi} from './config';
import {sortSliceByDate} from '../util/helpers';

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
      // note: this uses immer
      merge: (currentCacheData, responseData) => {
        const currentCacheIds = currentCacheData.map((slice) => slice.id);
        // keeping this here to remember how to print out the immer proxy
        // console.log(JSON.parse(JSON.stringify(currentCacheIds)));

        // only add data to cache if not already in there
        responseData.forEach((slice) => {
          if (!currentCacheIds.includes(slice.id)) {
            currentCacheData.push(slice);
          }
        });
        // make sure the resulted data is sorted like we want
        currentCacheData.sort(sortSliceByDate);
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
