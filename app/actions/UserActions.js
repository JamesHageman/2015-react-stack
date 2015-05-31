import alt from '../alt'
import UserService from '../services/UserService'

class UserActions {
  checkSession() {
    this.dispatch();

    UserService.checkSession().then((data) => {
      this.actions.receiveSession(data);
    }).catch(() => {
      this.actions.noSession();
    })
  }

  receiveSession(data) {
    this.dispatch(data);
  }

  noSession() {
    this.dispatch();
  }

}

export default alt.createActions(UserActions)