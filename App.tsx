import React, {useEffect, useState} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import store, {persistor} from './src/redux/store';
import Toast from 'react-native-toast-message';
import {ActivityIndicator, View} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {loadAuthState} from './src/redux/authSlice';
import {CartProvider} from './src/context/CartContext';
import {UpdateProvider} from './src/context/updateContext';
import {FormProvider} from './src/screens/context/FormContextType';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<ActivityIndicator size="large" color="#0000ff" />}
        persistor={persistor}>
        <CartProvider>
          <FormProvider>
            <UpdateProvider>
              <AppWithRedux />
            </UpdateProvider>
          </FormProvider>
        </CartProvider>
      </PersistGate>
      <Toast />
    </Provider>
  );
}

function AppWithRedux() {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(true);
  const {isLoggedIn} = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn !== null) {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator />;
}
