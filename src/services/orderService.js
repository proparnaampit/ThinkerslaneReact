import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const orderService = createApi({
  reducerPath: 'orderService',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Order'],
  endpoints: builder => ({
    addOrderCash: builder.mutation({
      query: payload => ({
        url: 'addOrder',
        method: 'POST',
        body: payload,
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

    // 🆕 New endpoint: checkCoupon
    checkCoupon: builder.mutation({
      query: ({coupon_code}) => {
        const formData = new FormData();
        formData.append('coupon_code', coupon_code);

        return {
          url: 'https://thinkerslane.com/th1/checkCoupon',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useAddOrderCashMutation,
  useGetOrderDetailsQuery,
  useGetOrderHistoryQuery,
  useCheckCouponMutation, // ← new hook
} = orderService;
