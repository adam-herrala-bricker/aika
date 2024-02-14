import {appApi} from './config';

export const permissionApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    setPermissions: build.mutation({
      // options = streamId plus username
      query: (options) => ({
        url: `/permissions/${options.streamId}`,
        method: 'PUT',
        body: {
          username: options.username
        }
      }),
      invalidatesTags: ['Permission']
    })
  })
});

export const {
  useSetPermissionsMutation
} = permissionApi;
