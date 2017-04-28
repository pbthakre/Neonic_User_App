import React, { Component } from 'react'
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { observable } from 'mobx'
import { Observer } from 'mobx-react/native'
import Button from './Button'
import testID from './testID'

const STRIPE_KEY = "pk_test_nQDUW50cligrU9HglXiKZ8G9"
const STRIPE_SECRET_KEY = "sk_test_6m8u60lgg64mK3ARHq8pIO0e"

function stripeURLEndPoint(){
  const stripeUrl = 'https://api.stripe.com/v1'
  return function(endpoint){
    return `${stripeUrl}/${endpoint}`
  }
}

function encodedBody(simpleObject){

}


class MobxStore {
  @observable token = ''

  @observable loading = false

  changeToken (newToken) {
    this.token = newToken
  }
  toggleLoader () {
    const Loader = this.loading
    this.loading = !Loader
  }
}

const store = new MobxStore();

export default class CardFormScreen extends Component {
  state = {
    loading: false,
    modalView: false
  }

  toggleModalView = async () => {
    this.setState({
      modalView: !this.state.modalView
    })
  }

  handleCardPayPress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const token = await stripe.paymentRequestWithCardForm({
        smsAutofillDisabled: true, // iOS only
      })

      console.log('Result:', token) // eslint-disable-line no-console
      this.setState({
        loading: false,
        token,
      })
    } catch (error) {
      console.log('Error:', error) // eslint-disable-line no-console
      this.setState({
        loading: false,
      })
    }
  }

  render() {
    const { loading, modalView } = this.state
    const { token } = store
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Card Form Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        <Button
          text="Enter your card details and pay"
          loading={loading}
          onPress={this.toggleModalView}
          {...testID('cardFormButton')}
        />
        {modalView &&
          <Modal
          animationType={"slide"}
          transparent={true}
          visible={modalView}
          onRequestClose={() => {console.log('Modal closed')}}
          >
          <CardInsideModal toggleModalView={() => this.toggleModalView()}/>
          </Modal>
        }
        <View
          style={styles.token}
          {...testID('cardFormToken')}>
          <Observer>
          {() => <Text style={styles.instruction}>Token: {token}</Text>}
          </Observer>
        </View>
      </View>
    )
  }
}

class CardInsideModal extends Component {
  constructor(){
    super()

    this.state = {
      CardNumber: "4242424242424242",
      Month: "4",
      Year: "2018",
      CVV: "314",
      loading: false,
    }
  }

  tokenizeCard(){
    const cardDetails = {
      "card[number]": this.state.CardNumber,
      "card[exp_month]": Number(this.state.Month),
      "card[exp_year]": Number(this.state.Year),
      "card[cvc]": Number(this.state.CVV)
    }
    let urlGenerator = stripeURLEndPoint();
    const tokenEndPoint = urlGenerator("tokens")
    let request = {}
    let reqHeader = {};
    reqHeader['Accept'] = 'application/json'
    reqHeader['Content-Type'] = 'application/x-www-form-urlencoded'
    reqHeader['Authorization'] = `Bearer ${STRIPE_KEY}`
    request['headers'] = reqHeader
    request['method'] = 'post'
    let cardBody = [];
    for (var property in cardDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(cardDetails[property]);
      cardBody.push(encodedKey + "=" + encodedValue);
    }
    cardBody = cardBody.join("&");
    request['body'] = cardBody
    store.toggleLoader()
    fetch(tokenEndPoint, request)
    .then((res) => res.json())
    .then((res) => {
      // const chargeUrl = urlGenerator("charges")
      // let chargeJSON =  {}
      // chargeJSON['amount'] = "200"
      // chargeJSON['currency'] = "usd"
      // chargeJSON['source'] = res.id
      // chargeJSON['description'] = "First Charge"
      // let chargeBody = [];
      // for (var property in chargeJSON) {
      //   var encodedKey = encodeURIComponent(property);
      //   var encodedValue = encodeURIComponent(chargeJSON[property]);
      //   chargeBody.push(encodedKey + "=" + encodedValue);
      // }
      // chargeBody = chargeBody.join("&");
      // reqHeader['Authorization'] = `Bearer ${STRIPE_SECRET_KEY}`
      // request['body'] = chargeBody
      // return fetch(chargeUrl,request)
      store.changeToken(res.id)
      store.toggleLoader()
      this.props.toggleModalView()
    })
    .then((resJ) => resJ.json())
    .then((res) => console.log('new res',res))
  }

  inputView(field){
    return (
      <View style={styles.inputView}>
        <Text style={styles.inputTag}>
          {field}
        </Text>
        <TextInput value={this.state[field]} keyboardType={'numeric'} underlineColorAndroid={'transparent'} style={styles.inputField}>
        </TextInput>
      </View>
    )
  }

  render(){
    const { loading } = store

    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.closeButton} onPress={() => this.props.toggleModalView()}>
            &times;
          </Text>
        </View>
        <View style={styles.modalBody}>
          {this.inputView('CardNumber')}
          {this.inputView('Month')}
          {this.inputView('Year')}
          {this.inputView('CVV')}
          <Observer>
            {() => <ActivityIndicator
              animating={loading}
              style={[styles.centering, {height: 80}]}
              size="large"
            />}
          </Observer>
          <TouchableOpacity onPress={() => this.tokenizeCard()} style={styles.payButton}>
            <Text>
              Tokenize
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
  modalContainer: {
    flex:1,
    backgroundColor:'white',
  },
  modalHeader: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor:'rgb(67,88,101)',
  },
  modalBody: {
    flex:1,
  },
  closeButton: {
    position: 'absolute',
    right: 17,
    top: 18,
    fontSize: 36,
    color: 'rgb(0,169,161)',
  },
  payButton: {
    height:40,
    justifyContent: 'center',
    backgroundColor: 'rgb(239,69,51)',
  },
  inputView: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'center',
    marginBottom:10,
  },
  modalBody: {

  },
  inputTag: {
    marginLeft: 12,
    flex:0.3,
  },
  inputField: {
    flex:1,
    height: 40,
    borderRadius:5,
    borderColor:'black',
    marginRight: 12,
    alignSelf: 'center',
    padding:5,
    borderWidth:1,
    borderBottomColor: 'black',
  },
  payButton: {
    height: 50,
    alignSelf: 'center',
    backgroundColor: 'rgb(239,69,53)',
    borderRadius: 5,
    justifyContent: 'center',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
})
