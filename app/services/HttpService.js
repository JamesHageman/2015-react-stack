import $ from 'jquery'
import Promise from 'bluebird'
import HttpActions from '../actions/HttpActions'


const HttpService = {
  request(url, opts) {
    var args = {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      },
      type: 'json',

      // merge the options provided
      ...opts,

      // add url last
      url
    };

    HttpActions.startRequest();

    return new Promise((resolve, reject) => {
      $.ajax(args).then((data) => {
        resolve(data);
      }).fail((statusText) => {
        reject(statusText);
      }).always(() => {
        HttpActions.endRequest();
      });
    });

  }
}

export default HttpService
