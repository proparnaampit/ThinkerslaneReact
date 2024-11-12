import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state setup
const authSlice = createSlice({
  name: 'auth',
  initialState: {isLoggedIn: false, userId: null, token: null},
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.userId = null;
      state.token = null;
    },
    setAuthState: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
  },
});

export const loadAuthState = () => async dispatch => {
  const token = await AsyncStorage.getItem('authToken');
  const userId = await AsyncStorage.getItem('userId');

  if (token && userId) {
    dispatch(authSlice.actions.setAuthState({isLoggedIn: true, userId, token}));
  } else {
    dispatch(
      authSlice.actions.setAuthState({
        isLoggedIn: false,
        userId: null,
        token: null,
      }),
    );
  }
};

export const saveAuthState = async (userId, token) => {
  if (userId && token) {
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('authToken', token);
  } else {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('authToken');
  }
};

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
