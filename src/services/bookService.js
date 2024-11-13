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
    fetchBooks: builder.query({
      query: searchTerm => {
        const url = `https://staging.thinkerslane.com/th1/getBooks?search=${searchTerm}`;
        return url;
      },
      transformResponse: response => {
        return response.data || [];
      },
    }),
  }),
});

export const {useFetchAllBooksQuery, useFetchBooksQuery} = bookService;
