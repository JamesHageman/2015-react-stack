import alt from '../alt';
import '../vendor/bootstrap-notify';
import $ from 'jquery';

class HttpActions {
  constructor() {
    this.generateActions('startRequest', 'endRequest');
  }

  failRequest(args, textStatus, errorThrown) {
    // show generic error message
    $.notify({
      message: args.errorMessage + ' ' +
             '<em>' + textStatus + ' ' + errorThrown + '</em>',
      icon: 'fa fa-exclamation-circle'
    }, {
      type: 'danger'
    });

    this.dispatch();
  }
}

export default alt.createActions(HttpActions);
