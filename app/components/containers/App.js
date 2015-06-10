import React, {Component} from 'react'
import TopLevelBox from '../ui/TopLevelBox'
import Box from '../ui/Box'
import Header from './Header'
import MainSection from './MainSection'
import Menu from './Menu'
import connect from '../connect'
import UserStore from '../../stores/UserStore'


@connect({
  stores: {
    UserStore
  },
  transform: (stores) => {
    return {
      loggedIn: !!stores.UserStore.user
    }
  }
})
class App extends Component {
  render() {
    var {loggedIn} = this.props;

    return (
      <TopLevelBox>
        <Header/>
        { (loggedIn) &&
          <Box padding={false} grow>
            <Menu/>
            <MainSection {...this.props}/>
          </Box>
        }
      </TopLevelBox>
    );
  }
}

export default App;
