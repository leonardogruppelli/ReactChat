import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { View, Button } from 'react-native'

const Login = ({ navigation }) => {
  const login = async () => {
    await AsyncStorage.setItem('token', 'f9812f9awd08219');
    navigation.navigate('App');
  };

  return (
    <View>
      <Button title="Sign in!" onPress={() => login()} />
    </View>
  );
}

export default Login