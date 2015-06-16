import React from 'react';
import styles from '../stylesheets/UserMenu.less';
import Icon from './Icon';
import cx from 'classnames';

var UserMenu = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
      name: React.PropTypes.string,
      imageUrl: React.PropTypes.string
    })
  },

  render() {
    var {name} = this.props.user;

    return (
      <div className={styles.base} onClick={this._handleClick}>
        <Icon name="user" className={styles.icon}/>
        {name}
      </div>
    );

  }
});

export default UserMenu;
