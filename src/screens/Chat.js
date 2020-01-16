import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import AsyncStorage from '@react-native-community/async-storage'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

const Chat = ({ navigation }) => {
  const socket = useSelector(state => state.socket)
  const connected = useSelector(state => state.connected)
  const id = socket.id
  const room = navigation.getParam('room')
  const [message, setMessage] = useState(null)
  const [messages, setMessages] = useState([])
  const list = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      try {
        socket.emit('join', room)

        socket.on('exchange', message => {
          setMessages(messages => [...messages, message])
        })

        socket.on('disconnect', () => {
          dispatch({ type: 'disconnect' })
        })

        try {
          const _messages = await AsyncStorage.getItem(`messages:${room}`)

          if (iterable(_messages)) {
            console.log('found messages: ', _messages)
            setMessages(JSON.parse(_messages))
          }
        } catch (error) {
          console.log('Error retrieving data: ' + error)
        }

        if (list.current) {
          list.current.scrollToEnd({ animated: true })
        }
      } catch (error) {
        console.log(error)
      }
    }

    init()

    return () => {
      socket.emit('leave', room)
    }
  }, [])

  useEffect(() => {
    if (list.current) {
      list.current.scrollToEnd({ animated: true })
    }

    if (messages) {
      AsyncStorage.setItem(`messages:${room}`, JSON.stringify(messages))
    }
  }, [messages])

  const send = () => {
    if (!message) {
      return;
    }

    socket.emit('message', {
      from: id,
      to: room,
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

  const iterable = object => {
    try {
      const array = [...object]

      if (array instanceof Array) {
        return true
      }
    } catch (error) {
      return false
    }
  }

  return (
    <Container>
      <Header title="Chat" />
      {connected && (
        <Room>
          <Room__Messages ref={list}>
            {messages &&
              messages.map((item, index) => (
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

export default Chat
