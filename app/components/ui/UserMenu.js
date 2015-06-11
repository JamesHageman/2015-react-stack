import React from 'react'
import Box from './Box'
import styles from '../stylesheets/UserMenu.css'
import Icon from './Icon'

var UserMenu = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
      name: React.PropTypes.string,
      imageUrl: React.PropTypes.string
    })
  },

  render() {
    var {name, imageUrl} = this.props.user;
    return (
      <Box verticalAlign className={styles.base}>
        <Box padding={false} noCollapse>
          <Icon name="user" className={styles.icon}/>
          {name}
        </Box>
      </Box>
    );

  }
});

export default UserMenu