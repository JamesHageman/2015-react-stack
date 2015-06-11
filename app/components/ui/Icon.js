import React from 'react'
import cx from 'classnames'
import 'font-awesome/css/font-awesome.css'
import styles from '../stylesheets/Icon.css'
import _ from 'underscore'

var Icon = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  _getIconProps() {
    return _.omit(this.props, ['name', 'className']);
  },

  render() {
    return (
      <i
        className={
          cx(
            'fa',
            'fa-' + this.props.name,
            styles.base,
            this.props.className
          )
        }
        {...this._getIconProps()}
        />
    );
  }
});

export default Icon;