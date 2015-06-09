import React, {Component} from 'react'
import TopLevelBox from '../ui/TopLevelBox'
import Header from './Header'
import MainSection from './MainSection'
import connect from '../connect'
import UserStore from '../../stores/UserStore'

@connect({
  stores: {
    UserStore
  }
})
class App extends Component {
  render() {
    var {user} = this.props.UserStore;

    return (
      <TopLevelBox>
        <Header/>
        { (user) &&
          <MainSection {...this.props}/>
        }
      </TopLevelBox>
    );
  }
}

export default App;
