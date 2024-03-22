import {appApi} from './config';
import {sortSliceByDate} from '../util/helpers';

export const sliceApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getSlices: build.query({
      query: ({streamId, limit, offset, search, res}) => ({
        url: `/slices/view/${streamId}`,
        method: 'POST',
        body: {limit, offset, search, res}
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
      query: ({slice, streamId}) => {
        // sending as form data
        const formData = new FormData();
        Object.keys(slice).forEach((key) => {
          formData.append(key, slice[key]);
        });

        return {
          url: `/slices/${streamId}`,
          formData: true,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['Slice']
    }),

    deleteSlice: build.mutation({
      query: (sliceId) => ({
        url: `/slices/${sliceId}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Slice']
    })
  })
});

export const {
  useDeleteSliceMutation,
  useGetSlicesQuery,
  useNewSliceMutation
} = sliceApi;
