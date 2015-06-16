import React, {Component} from 'react';
import MenuStore from '../../stores/MenuStore';
import connect from '../connect';
import NavList from '../ui/NavList';
import styles from '../stylesheets/Menu.less';
import cx from 'classnames';

@connect({
  stores: {
    MenuStore: MenuStore
  }
})
class Menu extends Component {
  render() {
    var menuItems = this.props.MenuStore.menuItems;

    return (
      <div className={cx('col-md-3', 'col-sm-12', styles.base)}>
        <NavList items={menuItems}/>
      </div>
    );
  }
}

export default Menu;
