import React, { Component } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import CardFormScreen from './src/CardFormScreen'

class RootView extends Component {
  constructor(){
    super()
  }

  handleButtonPress = () => {
      this.props.navigator.push({
        component: CardFormScreen
      })
  }

  render(){
    return(
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={() => this.handleButtonPress()}>
          <Text style={styles.text}>
            Stripe Demo
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent:'space-around',
      alignItems: 'center',
    },
    button : {
      height: 100,
      width: 300,
      backgroundColor: 'rgb(239,69,53)',
      justifyContent:'center',
      alignItems:'center',
      borderRadius: 5,
    },
    text: {
      fontSize: 25,
    }
})

export default RootView
