import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {isLoggedIn: false, user: null},
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
    },
    setAuthState: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    },
  },
});

export const loadAuthState = () => async dispatch => {
  const userData = await AsyncStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    dispatch(authSlice.actions.setAuthState({isLoggedIn: true, user}));
  } else {
    dispatch(authSlice.actions.setAuthState({isLoggedIn: false, user: null}));
  }
};

export const saveAuthState = async user => {
  if (user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem('user');
  }
};

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
