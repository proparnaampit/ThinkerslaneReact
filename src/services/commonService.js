import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const commonService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    fetchUserInfo: builder.query({
      query: userId => `/getUserinfo?user_id=${userId}`,
      keepUnusedDataFor: 86400,
    }),
  }),
});

export const {useFetchUserInfoQuery} = commonService;
