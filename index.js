'use strict'

// Redux
import { Platform } from 'react-native'
// Navigation
import { Navigation } from 'react-native-navigation'

import { registerScreens } from './src/screens'

registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'alerm_app.Home',
    navigatorStyle: {
      navBarNoBorder: true,
      drawUnderNavBar: true,
      navBarTranslucent: Platform.OS === 'ios',
      navBarTransparent: true,
      navBarBackgroundColor: 'transparent',
    },
  },
})
