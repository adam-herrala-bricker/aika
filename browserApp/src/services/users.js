import {appApi} from './config';

export const userApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (credentials) => ({ // this always needs to be a single argument
        url: '/login',
        method: 'POST',
        body: credentials
      }),
    }),

    registerUser: build.mutation({
      query: (userInfo) => ({
        url: '/users',
        method: 'POST',
        body: userInfo
      })
    })
  })
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
} = userApi;
