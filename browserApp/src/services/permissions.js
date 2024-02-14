import {appApi} from './config';

export const permissionApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    setPermissions: build.mutation({
      // options = streamId plus username and permission settings
      query: (options) => ({
        url: `/permissions/${options.streamId}`,
        method: 'PUT',
        body: {
          ...options.body
        }
      }),
      invalidatesTags: ['Permission']
    })
  })
});

export const {
  useSetPermissionsMutation
} = permissionApi;
