import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import {authApi} from '../services/authApi';
import {commonService} from '../services/commonService';
import {bookService} from '../services/bookService';
import {expenseService} from '../services/expenseService';
import {orderService} from '../services/orderService';

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
    [expenseService.reducerPath]: expenseService.reducer,
    [orderService.reducerPath]: orderService.reducer,
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
      expenseService.middleware,
      orderService.middleware,
    ),
});

export const persistor = persistStore(store);

export default store;
