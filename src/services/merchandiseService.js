import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuth} from '../api/baseQuery';

export const merchandiseService = createApi({
  reducerPath: 'merchandiseService',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['MerchandiseList'],
  endpoints: builder => ({
    // Merchandise category tree (with `subcategories`). GET.
    getAllMerchantCategory: builder.query({
      query: () => 'https://thinkerslane.com/thAdmin/getAllMarchentCategory',
      keepUnusedDataFor: 3600,
    }),
    // Fields + size chart for a category (not subcategory). GET.
    getCategoryFields: builder.query({
      query: ({categoryId = 0, subcategoryId = 0} = {}) =>
        `https://thinkerslane.com/thAdmin/get-category-fields?category_id=${categoryId}&subcategory_id=${subcategoryId}`,
      keepUnusedDataFor: 300,
    }),
    // All merchandise products. GET.
    getAllMerchandiseProducts: builder.query({
      query: () => 'https://thinkerslane.com/thAdmin/allMarchentProduct',
      providesTags: ['MerchandiseList'],
    }),
    // Full edit details of one product (fields with their saved values). GET.
    getMerchandiseEditDetails: builder.query({
      query: productId =>
        `https://thinkerslane.com/thAdmin/editMarchentProduct?product_id=${productId}`,
      keepUnusedDataFor: 0,
    }),
    // Save a new merchandise product. POST.
    uploadMerchandise: builder.mutation({
      query: payload => ({
        url: 'https://thinkerslane.com/thAdmin/save-marchent-product',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['MerchandiseList'],
    }),
    // Update an existing merchandise product. POST.
    updateMerchandise: builder.mutation({
      query: payload => ({
        url: 'https://thinkerslane.com/thAdmin/updateMerchantPoduct',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['MerchandiseList'],
    }),
    // Delete a merchandise product. POST.
    deleteMerchandise: builder.mutation({
      query: payload => ({
        url: 'https://thinkerslane.com/thAdmin/deleteMerchantProduct',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['MerchandiseList'],
    }),
  }),
});

export const {
  useDeleteMerchandiseMutation,
  useUpdateMerchandiseMutation,
  useGetAllMerchantCategoryQuery,
  useGetCategoryFieldsQuery,
  useGetMerchandiseEditDetailsQuery,
  useGetAllMerchandiseProductsQuery,
  useUploadMerchandiseMutation,
} = merchandiseService;
