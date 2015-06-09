import alt from '../alt'
import UserActions from '../actions/UserActions'

class UserStore {
  constructor() {
    /*
    For any value in a store:
      undefined -> the data is loading
      null      -> the data does not exist
     */
    this.user = null;

    this.bindActions(UserActions);

    this.exportPublicMethods({
      loggedIn: this.loggedIn
    });
  }

  onCheckSession() {
    this.user = undefined;
  }

  onNoSession() {
    this.user = null;
  }

  onReceiveSession(data) {
    this.user = data.user;
  }

  loggedIn() {
    return !!this.user;
  }
}

export default alt.createStore(UserStore);
