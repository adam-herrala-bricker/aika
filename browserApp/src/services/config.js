import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const appApi = createApi({
  reducerPath: 'appApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api`, // eslint-disable-line no-undef
  }),

  endpoints: () => ({}), // need empty endpoints here

  tagTypes: ['Post'], // currently not using tags for anything
});

// could put more here if we wanted