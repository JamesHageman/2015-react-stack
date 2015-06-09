import React, {Component} from 'react'
import connect from '../connect'
import Box from '../ui/Box'
import UserStore from '../../stores/UserStore'
import styles from '../stylesheets/Header.css'

@connect({
  stores: {
    UserStore
  }
})
class Header extends Component {
  render() {
    var {user} = this.props.UserStore;

    return (
      <Box padding={false} className={styles.base}>
        <Box grow>
          My App.
        </Box>
        <Box>
          {user === undefined &&
            'Loading...'
          }
          {user === null &&
            'Not logged in'
          }
          {user &&
            'Logged in as ' + user.name
          }
        </Box>
      </Box>
    )
  }
}

export default Header