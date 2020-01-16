import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector, useDispatch } from 'react-redux'
import { withNavigation } from 'react-navigation'
import styled from 'styled-components'

const Header = ({ title, navigation }) => {
  const socket = useSelector(state => state.socket)
  const dispatch = useDispatch()

  const logout = async () => {
    await AsyncStorage.removeItem('token')
    socket.disconnect()
    dispatch({ type: 'DISCONNECT' })
    navigation.navigate('Auth')
  }

  return (
    <Element>
      <Element__Text>{title}</Element__Text>
      <Logout__Button onPress={() => logout()}>
        <Logout__Button__Wrapper>
          <Logout__Button__Text>Logout</Logout__Button__Text>
        </Logout__Button__Wrapper>
      </Logout__Button>
    </Element>
  )
}

const Element = styled.View`
  width: 100%;
  position: relative;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`

const Element__Text = styled.Text`
  font-size: 20px;
  color: #000;
  text-transform: uppercase;
`

const Logout__Button = styled.TouchableWithoutFeedback``

const Logout__Button__Wrapper = styled.View`
  width: 20px;
  height: 20px;
  margin-left: auto;
  background-color: red;
`

const Logout__Button__Text = styled.Text`
  color: #fff;
`

export default withNavigation(Header)
