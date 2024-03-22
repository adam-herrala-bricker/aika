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
    }),

    logoutUser: build.mutation({
      query: () => ({
        url: '/login',
        method: 'DELETE'
      })
    }),

    changePassword: build.mutation({
      query: (passwords) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: passwords
      })
    }),

    deleteAccount: build.mutation({
      query: (password) => ({
        url: '/users',
        method: 'DELETE',
        body: password
      })
    })
  })
});

export const {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
} = userApi;
