import React, { useEffect } from 'react'
import Header from '../components/Header'
import io from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

const HOST = 'https://92324196.ngrok.io'

const Channels = ({ navigation }) => {
  const connected = useSelector(state => state.connected)
  const rooms = [
    {
      id: 'condominio-1',
      title: 'Vila das Rosas'
    },
    {
      id: 'condominio-2',
      title: 'Alphaville'
    },
    {
      id: 'condominio-3',
      title: 'Minha Casa minha Vida'
    }
  ]
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = io(HOST)

    socket.on('connect', () => {
      dispatch({ type: 'CONNECT', socket: socket })
    })
  }, [])

  const join = id => {
    navigation.navigate('Chat', {
      room: id
    })
  }

  return (
    <Container>
      <Header title="Channels" />
      {connected &&
        rooms.map((item, index) => (
          <Room onPress={() => join(item.id)} key={index}>
            <Room__Content>
              <Room__Text>{item.title}</Room__Text>
            </Room__Content>
          </Room>
        ))}
    </Container>
  )
}

const Container = styled.SafeAreaView`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #fff;
`

const Room = styled.TouchableWithoutFeedback``

const Room__Content = styled.View`
  padding: 10px;
  background-color: #eee;
`

const Room__Text = styled.Text`
  font-size: 20px;
  color: #000;
`

export default Channels
