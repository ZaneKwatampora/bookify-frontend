import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/reviews`,
    credentials: 'include',
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    fetchReviewsByBook: builder.query({
      query: (bookId) => `/${bookId}`,
      providesTags: ['Reviews']
    }),
    addReview: builder.mutation({
      query: (review) => ({
        url: '/',
        method: 'POST',
        body: review,
      }),
      invalidatesTags: ['Reviews']
    })
  }),
});

export const { useFetchReviewsByBookQuery, useAddReviewMutation } = reviewsApi;
