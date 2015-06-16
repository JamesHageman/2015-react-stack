import React, {Component} from 'react';
import TopLevelBox from '../ui/TopLevelBox';
import Header from './Header';
import MainSection from './MainSection';
import Menu from './Menu';
import connect from '../connect';
import UserStore from '../../stores/UserStore';


@connect({
  stores: {
    UserStore: UserStore
  },
  transform: (stores) => {
    return {
      loggedIn: (!!stores.UserStore.user)
    };
  }
})
class App extends Component {
  render() {
    var loggedIn = this.props.loggedIn;

    return (
      <TopLevelBox>
        <Header/>
        { (loggedIn) &&
          <div className="row">
            <Menu/>
            <MainSection {...this.props}/>
          </div>
        }
      </TopLevelBox>
    );
  }
}

export default App;
