import React, {Component} from 'react'
import MenuStore from '../../stores/MenuStore'
import connect from '../connect'
import Box from '../ui/Box'
import NavList from '../ui/NavList'
import styles from '../stylesheets/Menu.css'

@connect({
  stores: {
    MenuStore
  }
})
class Menu extends Component {
  render() {
    var {menuItems} = this.props.MenuStore;

    return (
      <Box padding={false} className={styles.base}>
        <NavList items={menuItems}/>
      </Box>
    );
  }
}

export default Menu