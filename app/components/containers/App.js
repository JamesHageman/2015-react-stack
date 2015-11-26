import React, {Component} from 'react';
import TopLevelBox from '../ui/TopLevelBox';
import Header from './Header';
import MainSection from './MainSection';
import Menu from './Menu';
import connect from '../connect';
import UserStore from '../../stores/UserStore';

class App extends Component {
  static propTypes = {
    loggedIn: React.PropTypes.bool
  }

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

export default connect({
  stores: {
    UserStore: UserStore
  },
  transform: (stores) => {
    return {
      loggedIn: (!!stores.UserStore.user)
    };
  }
})(App);
