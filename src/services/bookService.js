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
      query: ({search, pid}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (pid) params.append('pid', pid);
        const url = `/getBooks?${params.toString()}`;

        return url;
      },

      keepUnusedDataFor: 0,
      transformResponse: response => response.data || [],
    }),
    getAllPublishers: builder.query({
      query: () => 'https://thinkerslane.com/th1/getPublishers',
      keepUnusedDataFor: 86400,
    }),
    getAllCategory: builder.query({
      query: () => 'https://thinkerslane.com/thAdmin/getAllCategory',
      keepUnusedDataFor: 86400,
    }),
    uploadBooks: builder.mutation({
      query: payload => ({
        url: 'https://thinkerslane.com/thAdmin/addProducts',
        method: 'POST',
        body: payload,
      }),
    }),
    getBookDataByCodeFromServer: builder.query({
      query: isbn => {
        return `https://thinkerslane.com/thAdmin/getBookByIsbn?isbn_number=${isbn}`;
      },
    }),
    getproductNameDataByCodeFromServer: builder.query({
      query: ({productName = '', publisherId = '', isbn = ' '}) => {
        if (isbn) {
          return `https://thinkerslane.com/thAdmin/getBookByIsbn?isbn_number=${isbn}`;
        } else if (publisherId) {
          return `https://thinkerslane.com/th1/getBooksByName?search_keyword=${productName}&publisher_id=${publisherId}`;
        } else {
          return `https://thinkerslane.com/th1/getBooksByName?search_keyword=${productName}`;
        }
      },
    }),
    updateBook: builder.mutation({
      query: payload => {
        return {
          url: 'https://thinkerslane.com/thAdmin/updateProduct',
          method: 'POST',
          body: payload,
        };
      },
    }),
    deleteBook: builder.mutation({
      query: payload => ({
        url: 'https://thinkerslane.com/thAdmin/deleteProduct',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    }),
  }),
});
export const {
  useFetchAllBooksQuery,
  useFetchBooksQuery,
  useGetAllPublishersQuery,
  useGetAllCategoryQuery,
  useUploadBooksMutation,
  useLazyGetBookDataByCodeFromServerQuery,
  useLazyGetproductNameDataByCodeFromServerQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookService;
