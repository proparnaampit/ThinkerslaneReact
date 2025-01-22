import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const orderService = createApi({
  reducerPath: 'orderService',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Order'],
  endpoints: builder => ({
    addOrderCash: builder.mutation({
      query: ({
        user_id,
        payment_method,
        booking_user_details,
        pricing,
        booking_products,
      }) => ({
        url: 'addOrder',
        method: 'POST',
        body: {
          params: {
            user_id,
            payment_method,
            booking_user_details,
            pricing,
            booking_products,
          },
        },
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: ({order_id}) => ({
        url: `getOrderDetails?order_id=${order_id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    getOrderHistory: builder.query({
      query: ({user_id}) => ({
        url: `getOrder?user_id=${user_id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    getAllUsers: builder.query({
      query: () => `https://thinkerslane.com/th1/getAllUsers`,
      keepUnusedDataFor: 0,
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useAddOrderCashMutation,
  useGetOrderDetailsQuery,
  useGetOrderHistoryQuery,
  useGetAllUsersQuery,
} = orderService;
