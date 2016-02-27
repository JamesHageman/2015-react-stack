import React from 'react';
import PureRenderMixin from 'react-pure-render/mixin';
import SimpleTable from './SimpleTable';
import { Table as FixedTable } from 'fixed-data-table';
import isTouchDevice from './isTouchDevice';

var DataTableChild = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    simple: React.PropTypes.bool,

    // optional, persists state to local storage
    persistStateKey: React.PropTypes.string
  },

  getDefaultProps: () => ({
    simple: false
  }),

  render() {
    return (
      (this.props.simple || isTouchDevice()) ?
        <SimpleTable {...this.props}
          persistStateKey={
            this.props.persistStateKey ?
              (this.props.persistStateKey + '_simpleTable') :
              undefined
          }/>
      :
        <FixedTable {...this.props}/>
    );
  }
});

export default DataTableChild;
