import React from 'react';
import $ from 'jquery';

var listeners = [];
var stateCache;
var CACHE_KEY = 'PersistStateMixin_Cache';

try {
  const stored = window.localStorage.getItem(CACHE_KEY);
  if (stored) {
    stateCache = JSON.parse(stored);
  } else {
    stateCache = {};
  }
} catch (e) {
  stateCache = {};
}

$(window).on('beforeunload', () => {
  listeners.forEach(obj => {
    if (obj.props.persistStateKey) {
      stateCache[obj.props.persistStateKey] = obj._getStateToPersist(true);
    }
  });

  if (window.localStorage) {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(stateCache));
  }
});

export default {
  propTypes: {
    persistStateKey: React.PropTypes.string
  },

  componentDidMount() {
    var {persistStateKey} = this.props;

    if (this.props.persistStateKey) {
      stateCache[persistStateKey] = this._getStateToPersist(false);
      this.__PersistStateMixin_Init();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    var {persistStateKey} = this.props;

    if (this.props.persistStateKey) {
      stateCache[persistStateKey] = this._getStateToPersist(false);
      this.__PersistStateMixin_Init();
    }
  },

  getPersistedState() {
    var {persistStateKey} = this.props;

    if (!persistStateKey) {
      return {};
    }

    if (stateCache[persistStateKey]) {
      return stateCache[persistStateKey];
    }

    return {};
  },

  componentWillUnmount() {
    var {persistStateKey} = this.props;
    if (persistStateKey) {
      stateCache[persistStateKey] = {
        ...this._getStateToPersist(false)
      };
    }
  },

  _getStateToPersist(savingToLocalStorage) {
    if (this.getStateToPersist) {
      return this.getStateToPersist(savingToLocalStorage);
    }
    return this.state;
  },

  __PersistStateMixin_Init() {
    listeners = listeners.filter(obj => (
      obj.props.persistStateKey !== this.props.persistStateKey));
    listeners.push(this);
  }
};
