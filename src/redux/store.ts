import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import {authApi} from '../services/authApi';
import {commonService} from '../services/commonService';
import {bookService} from '../services/bookService';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    [authApi.reducerPath]: authApi.reducer,
    [commonService.reducerPath]: commonService.reducer,
    [bookService.reducerPath]: bookService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }).concat(
      authApi.middleware,
      commonService.middleware,
      bookService.middleware,
    ),
});

export const persistor = persistStore(store);

export default store;
