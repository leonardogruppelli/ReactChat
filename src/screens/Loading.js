import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { ActivityIndicator, StatusBar, View } from 'react-native'

const Loading = ({ navigation }) => {
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')

      navigation.navigate(token ? 'App' : 'Auth')
    }

    init()
  }, [])

  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  )
}

export default Loading