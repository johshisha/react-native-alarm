'use strict'

import { Navigation } from 'react-native-navigation'

import Home from './components/pages/Home'

export function registerScreens() {
  // Pages
  Navigation.registerComponent('alerm_app.Home', () => Home)
}
