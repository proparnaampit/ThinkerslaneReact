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
        console.log(url);

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
      query: isbn =>
        `https://staging.thinkerslane.com/thAdmin/getBookByIsbn?isbn_number=${isbn}`,
      keepUnusedDataFor: 86400,
    }),
    updateBook: builder.mutation({
      query: payload => ({
        url: 'https://staging.thinkerslane.com/thAdmin/updateProduct',
        method: 'POST',
        body: payload,
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
  useGetBookDataByCodeFromServerQuery,
  useUpdateBookMutation,
} = bookService;
