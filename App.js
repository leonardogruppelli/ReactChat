import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import styled from 'styled-components'
import io from 'socket.io-client'

let socket = null

const App = () => {
  const [connected, setConnected] = useState(false)
  const [id, setId] = useState(null)
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState(null)
  const [messages, setMessages] = useState([])
  const list = useRef(null)

  useEffect(() => {
    const init = async () => {
      try {
        const _messages = await AsyncStorage.getItem('messages')

        setMessages(JSON.parse(_messages))
        if (list.current) {
          list.current.scrollToEnd({ animated: true })
        }
      } catch (error) {
        console.log(error)
      }

      if (socket) {
        socket.close()
      }

      socket = io('https://27b2fdc7.ngrok.io')

      socket.on('connect', () => {
        setId(socket.id)
        setConnected(true)
      })

      socket.on('joined', (user) => {
        setUsers(users => [...users, user])
      })

      socket.on('exchange', message => {
        setMessages(messages => [...messages, message])
      })

      socket.on('disconnect', () => {
        setConnected(false)
      })
    }

    init()
  }, [])

  useEffect(() => {
    if (list.current) {
      list.current.scrollToEnd({ animated: true })
    }
    
    AsyncStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  const send = () => {
    socket.emit('message', {
      from: id,
      message: message,
      time: time()
    })

    setMessage(null)
  }

  const time = () => {
    const time = new Date()

    const hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    return `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }:${seconds < 10 ? '0' + seconds : seconds}`
  }

  return (
    <Container>
      <Header>
        <Header__Text>Chat</Header__Text>
        <Header__Button onPress={call}>
          <Header__Button__Content />
        </Header__Button>
      </Header>
      {connected && (
        <Room>
          <Room__Messages ref={list}>
            {messages.map((item, index) => (
              <Dialog
                direction={item.from == id ? 'right' : 'left'}
                last={index == messages.length - 1 ? true : false}
                key={index}
              >
                <Dialog__User>{item.from} says:</Dialog__User>
                <Dialog__Message>{item.message}</Dialog__Message>
                <Dialog__Time>at {item.time}</Dialog__Time>
              </Dialog>
            ))}
          </Room__Messages>

          <Room__Form>
            <Room__Input
              value={message}
              onChangeText={text => setMessage(text)}
            />
            <Button onPress={send}>
              <Button__Content>
                <Button__Text>Send</Button__Text>
              </Button__Content>
            </Button>
          </Room__Form>
        </Room>
      )}
    </Container>
  )
}

const Container = styled.SafeAreaView`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #fff;
`

const Header = styled.View`
  position: relative;
  align-items: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`

const Header__Text = styled.Text`
  font-size: 20px;
  color: #000;
  text-transform: uppercase;
`

const Header__Button = styled.TouchableWithoutFeedback``

const Header__Button__Content = styled.View`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  right: 15px
  background-color: #eb4034;
  border-radius: 50;
`

const Room = styled.View`
  flex: 1;
  padding: 0 15px 15px;
`

const Room__Messages = styled.ScrollView`
  flex: 1;
`

const Room__Form = styled.View`
  flex-direction: row;
`

const Room__Input = styled.TextInput`
  flex: 1;
  padding: 10px 20px;
  border: 1px solid #eee;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
`

const Dialog = styled.View`
  width: 60%;
  align-self: ${props =>
    props.direction == 'left' ? 'flex-start' : 'flex-end'};
  flex-direction: column;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: ${props => (props.last ? '15px' : '0')};
  background-color: ${props => (props.direction == 'left' ? '#eee' : '#fff')};
  border: 1px solid #eee;
  border-radius: 8px;
  align-items: ${props =>
    props.direction == 'left' ? 'flex-start' : 'flex-end'};
  color: #000;
`

const Dialog__User = styled.Text`
  font-size: 10px;
  font-weight: 300;
`

const Dialog__Message = styled.Text`
  margin-bottom: 5px;
  font-size: 16px;
`

const Dialog__Time = styled.Text`
  font-size: 10px;
  font-weight: 300;
`

const Button = styled.TouchableWithoutFeedback``

const Button__Content = styled.View`
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #fff;
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-top-color: #eee;
  border-right-color: #eee;
  border-bottom-color: #eee;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`

const Button__Text = styled.Text`
  text-transform: uppercase;
  color: #000;
`

export default App
