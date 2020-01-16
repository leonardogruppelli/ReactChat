import { createStore } from 'redux'

const STATE = {
  socket: null,
  user: [],
  connected: false
}

const REDUCERS = (state = STATE, action) => {
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        socket: action.socket,
        connected: true
      }

    case 'DISCONNECT':
      return {
        ...state,
        socket: null,
        connected: false
      }

    default:
      return state
  }
}

export const store = createStore(REDUCERS)