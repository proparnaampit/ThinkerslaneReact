import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const commonService = createApi({
  reducerPath: 'commonService',
  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    fetchUserInfo: builder.query({
      query: userId => `getUserinfo?user_id=${userId}`,
      keepUnusedDataFor: 86400,
    }),
    getAllUsers: builder.query({
      query: () => `https://staging.thinkerslane.com/th1/getAllUsers`,
      keepUnusedDataFor: 86400,
    }),
  }),
});

export const {useFetchUserInfoQuery, useGetAllUsersQuery} = commonService;
