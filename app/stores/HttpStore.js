import alt from '../alt'
import HttpActions from '../actions/HttpActions'

class HttpStore {
  constructor() {
    this.requestLog = [];
    this.numActiveRequests = 0;

    this.bindActions(HttpActions);
  }

  onStartRequest(opts) {
    this.requestLog.push(opts);
    this.numActiveRequests += 1;
  }

  onEndRequest() {
    this.numActiveRequests -= 1;
  }
}

export default alt.createStore(HttpStore)