import React, {Component} from 'react'
import connect from '../connect'
import Box from '../ui/Box'
import UserMenu from '../ui/UserMenu'
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
          My App
        </Box>
        <Box padding={false} verticalAlign>
          {user === undefined &&
            'Loading...'
          }
          {user &&
            <UserMenu user={user}/>
          }
        </Box>
      </Box>
    )
  }
}

export default Header