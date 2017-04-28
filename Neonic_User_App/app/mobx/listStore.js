import {observable} from 'mobx'


class ObservableListStore {
  @observable token = ''

  changeToken (newToken) {
    this.token = newToken
  }

}


const observableListStore = new ObservableListStore()
export default observableListStore
