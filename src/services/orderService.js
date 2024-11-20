import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const orderService = createApi({
  reducerPath: 'orderService',
  baseQuery: baseQueryWithAuth,
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
    }),
  }),
});

export const {useAddOrderCashMutation} = orderService;
