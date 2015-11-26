import React, {Component} from 'react';
import MenuStore from '../../stores/MenuStore';
import connect from '../connect';
import NavList from '../ui/NavList';
import styles from '../stylesheets/Menu.less';
import cx from 'classnames';

class Menu extends Component {
  static propTypes = {
    menuItems: React.PropTypes.array
  }
  render() {
    var menuItems = this.props.menuItems;

    return (
      <div className={cx('col-md-3', 'col-sm-12', styles.base)}>
        <NavList items={menuItems}/>
      </div>
    );
  }
}

export default connect({
  stores: {
    MenuStore: MenuStore
  },
  transform: (stores) => ({ menuItems: stores.MenuStore.menuItems })
})(Menu);
