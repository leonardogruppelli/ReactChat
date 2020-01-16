import Channels from './src/screens/Channels'
import Chat from './src/screens/Chat'
import Login from './src/screens/Login'
import Loading from './src/screens/Loading'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

const App = createAppContainer(
  createStackNavigator(
    {
      Channels: Channels,
      Chat: Chat
    },
    {
      headerMode: 'none'
    }
  )
)

const Auth = createStackNavigator(
  { Login: Login },
  {
    headerMode: 'none'
  }
)

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: Loading,
      App: App,
      Auth: Auth
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)
