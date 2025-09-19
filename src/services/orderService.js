import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const orderService = createApi({
  reducerPath: 'orderService',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Order'],
  endpoints: builder => ({
    addOrderCash: builder.mutation({
      query: payload => ({
        url: 'addOrderTest',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: ({order_id}) => ({
        url: `getBookingDetails?order_id=${order_id}`,
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
  }),
});

export const {
  useAddOrderCashMutation,
  useGetOrderDetailsQuery,
  useGetOrderHistoryQuery,
} = orderService;
