import {request} from './HttpService'

const UserService = {
  checkSession() {
    return request('http://www.mocky.io/v2/556a797fe66746ad0c151b52');
  }
}

export default UserService