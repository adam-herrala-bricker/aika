import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api`, // eslint-disable-line no-undef
  }),

  tagTypes: ['Post'], // currently not using tags for anything

  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (credentials) => ({ // this always needs to be a single argument
        url: '/login',
        method: 'POST',
        body: credentials
      }),
    })
  })
});

export const {useLoginUserMutation} = userApi;
