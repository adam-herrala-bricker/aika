import {appApi} from './config';
import {sortSliceByDateASC, sortSliceByDateDESC} from '../util/helpers';

export const sliceApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getSlices: build.query({
      query: ({streamId, limit, offset, search, strandId}) => ({
        url: `/slices/view/${streamId}`,
        method: 'POST',
        body: {limit, offset, search, strandId}
      }),

      // modifies the cache key so it's only the streamId, not limit or offset
      // (the cache key is based on all args passed to the query)
      serializeQueryArgs: ({queryArgs}) => {
        const newQueryArgs = queryArgs.streamId;
        return newQueryArgs;
      },

      // merges new response data into cache (it's replaced by default)
      // note: this uses immer
      merge: (currentCacheData, responseData, {arg}) => {
        const currentCacheIds = currentCacheData.map((slice) => slice.id);
        // keeping this here to remember how to print out the immer proxy
        // console.log(JSON.parse(JSON.stringify(currentCacheData)));

        // only add data to cache if not already in there
        responseData.forEach((slice) => {
          if (!currentCacheIds.includes(slice.id)) {
            currentCacheData.push(slice);
          }
        });

        // make sure the resulted data is sorted like we want
        if (arg.strandId) {
          currentCacheData.sort(sortSliceByDateASC);
        } else {
          currentCacheData.sort(sortSliceByDateDESC);
        }
      },

      // forces a refetch when the args change
      forceRefetch: (currentArgs, previousArgs) => {
        const argChange = currentArgs !== previousArgs;

        return argChange;
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
    }),

    getStrands: build.query({
      query: (streamId) => ({
        url: `strands/${streamId}`,
        method: 'GET'
      })
    })
  })
});

export const {
  useDeleteSliceMutation,
  useGetSlicesQuery,
  useGetStrandsQuery,
  useNewSliceMutation
} = sliceApi;
