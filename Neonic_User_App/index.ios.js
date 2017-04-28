/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react'
 import RootView from './app/RootView'

 import {
   AppRegistry,
   Navigator
 } from 'react-native'

 class Neonic_User_App extends Component {
   renderScene (route, navigator) {
     return <route.component {...route.passProps} navigator={navigator} />
   }
   configureScene (route, routeStack) {
     if (route.type === 'Modal') {
       return Navigator.SceneConfigs.FloatFromBottom
     }
     return Navigator.SceneConfigs.PushFromRight
   }
   render () {
     return (
       <Navigator
         configureScene={this.configureScene.bind(this)}
         renderScene={this.renderScene.bind(this)}
         initialRoute={{
           component: RootView
         }} />
     )
   }
 }
AppRegistry.registerComponent('Neonic_User_App', () => Neonic_User_App);
