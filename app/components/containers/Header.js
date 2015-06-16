import React, {Component} from 'react';
import connect from '../connect';
import UserMenu from '../ui/UserMenu';
import Spinner from '../ui/Spinner';
import UserStore from '../../stores/UserStore';
import HttpStore from '../../stores/HttpStore';
import styles from '../stylesheets/Header.less';
import cx from 'classnames';

@connect({
  stores: {
    UserStore: UserStore,
    HttpStore: HttpStore
  }
})
class Header extends Component {
  render() {
    var user = this.props.UserStore.user;
    var loadingSomething = this.props.HttpStore.numActiveRequests > 0;

    return (
      <div className={cx('row', styles.base)}>
        <div className="col-md-10 col-xs-9">
          My App
          { loadingSomething &&
            <Spinner/>
          }
        </div>
        <div className="col-md-2 col-xs-3">
          {user === undefined &&
            <Spinner/>
          }
          {user &&
            <UserMenu user={user}/>
          }
        </div>
      </div>
    );
  }
}

export default Header;
