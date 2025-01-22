import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    login: builder.mutation({
      query: ({email_id, password, device_id, location}) => {
        return {
          url: 'login',
          method: 'POST',
          body: {email_id, password, device_id, location},
        };
      },
    }),
    logout: builder.mutation({
      query: ({device_id}) => ({
        url: 'logout',
        method: 'POST',
        body: {device_id},
      }),
    }),
  }),
});

export const {useLoginMutation, useLogoutMutation} = authApi;
