import React, {Component} from 'react'
import connect from '../connect'
import Box from '../ui/Box'
import UserMenu from '../ui/UserMenu'
import Spinner from '../ui/Spinner'
import UserStore from '../../stores/UserStore'
import HttpStore from '../../stores/HttpStore'
import styles from '../stylesheets/Header.css'

@connect({
  stores: {
    UserStore,
    HttpStore
  }
})
class Header extends Component {
  render() {
    var {user} = this.props.UserStore;
    var loadingSomething = this.props.HttpStore.numActiveRequests > 0;

    return (
      <Box padding={false} className={styles.base}>
        <Box grow>
          <Box padding={false} noCollapse>
            My App
            { loadingSomething &&
              <Spinner/>
            }
          </Box>
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