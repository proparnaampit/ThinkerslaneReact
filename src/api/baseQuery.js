import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const token = await AsyncStorage.getItem('authToken');

  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};
