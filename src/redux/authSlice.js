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
  },
});

export const loadAuthState = () => async dispatch => {
  const userData = await AsyncStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    dispatch(login(user));
  }
};

export const saveAuthState = async user => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
