import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button, View, Text, StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();

const ScreenOne = ({navigation}:any) => {
  return (
    <View style={styles.container}>
      <Text>This is Screen One</Text>
      <Button
        title="Go to Screen Two"
        onPress={() => navigation.navigate('ScreenTwo')}
      />
    </View>
  );
};

const ScreenTwo = ({navigation}:any) => {
  return (
    <View style={styles.container}>
      <Text>This is Screen Two</Text>
      <Button
        title="Go to Screen One"
        onPress={() => navigation.navigate('ScreenOne')}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ScreenOne"
        screenOptions={{
          headerShown: true,
          gestureEnabled: true,
        }}>
        <Stack.Screen name="ScreenOne" component={ScreenOne} />
        <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
