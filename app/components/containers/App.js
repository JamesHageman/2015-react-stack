import React from 'react'
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin'
import UserStore from '../../stores/UserStore'
import TopLevelBox from '../ui/TopLevelBox'
import Box from '../ui/Box'

var App = React.createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStores: {
      UserStore
    }
  },

  render() {
    var {user} = this.state.UserStore;

    return (
      <TopLevelBox>
        <Box>
          <Box grow>
            Hello, world
          </Box>
          <Box>
            {user === undefined &&
              'Loading...'
            }
            {user === null &&
              'Not logged in'
            }
            {user &&
              user.name
            }
          </Box>
        </Box>
      </TopLevelBox>
    );
  }
});

export default App;