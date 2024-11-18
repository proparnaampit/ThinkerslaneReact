import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const expenseService = createApi({
  reducerPath: 'expenseService',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Expenses', 'ExpenseCategories'],
  endpoints: builder => ({
    fetchAllExpenseCategory: builder.query({
      query: userId => `getAllexpenseCategory`,
      keepUnusedDataFor: 0,
    }),
    addExpense: builder.mutation({
      query: ({user_id, amount, type, description}) => ({
        url: 'addExpense',
        method: 'POST',
        body: {
          user_id,
          amount,
          type,
          description,
        },
      }),
      invalidatesTags: ['Expenses', 'ExpenseCategories'],
    }),
    getExpenses: builder.query({
      query: user_id => `getExpense?user_id=${user_id}`,
      providesTags: ['Expenses'],
    }),
  }),
});

export const {
  useFetchAllExpenseCategoryQuery,
  useAddExpenseMutation,
  useGetExpensesQuery,
} = expenseService;
