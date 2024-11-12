import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const bookService = createApi({
  reducerPath: 'bookService',
  baseQuery: baseQueryWithAuth,
  endpoints: builder => ({
    fetchAllBooks: builder.query({
      query: userId => `/getAllBooks`,
      keepUnusedDataFor: 86400,
    }),
  }),
});

export const {useFetchAllBooksQuery} = bookService;
