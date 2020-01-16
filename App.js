import React from 'react'
import Navigator from './Navigator'
import { Provider } from 'react-redux'
import { store } from './store'

const App = () => (
  <Provider store={store}>
    <Navigator />
  </Provider>
)

export default App
