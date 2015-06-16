import $ from 'jquery';
import {Promise} from 'es6-promise';
import HttpActions from '../actions/HttpActions';


const HttpService = {
  request(url, opts) {
    var args = {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      },
      type: 'json',

      errorMessage: 'Error making request',

      // merge the options provided
      ...opts,

      // add url last
      url
    };

    HttpActions.startRequest(args);

    return new Promise((resolve, reject) => {
      $.ajax(args).then((data) => {
        resolve(data);
      }).fail((jqXHR, textStatus, errorThrown) => {
        HttpActions.failRequest(args, textStatus, errorThrown);
        reject(textStatus);
      }).always((result) => {
        HttpActions.endRequest(args, result);
      });
    });

  }
};

export default HttpService;
