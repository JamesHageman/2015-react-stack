import React from 'react';
import {Column} from 'fixed-data-table';
import {DataTableParent as Table} from './DataTable';
import Immutable, {Set, List, Map} from 'immutable';
import Icon from '../Icon';
import _ from 'underscore';
import styles from './stylesheets/GroupableDataTable.less';
import PersistStateMixin from './PersistStateMixin';

var GroupableDatatable = React.createClass({
  propTypes: {
    // Immutable.List of Immutable.Map
    data: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(List),
      React.PropTypes.arrayOf(React.PropTypes.object)
    ]),

    rowHeight: React.PropTypes.number.isRequired
  },

  mixins: [PersistStateMixin],

  getDefaultProps() {
    return {
      onRowClick: () => {},
      defaultGroupBy: null,
      renderFormControls: () => {}
    };
  },

  getInitialState() {
    var persisted = this.getPersistedState();
    if (persisted.expandedGroups) {
      persisted.expandedGroups = new Set(persisted.expandedGroups);
    }

    return {
      groupBy: this.props.defaultGroupBy,
      expandedGroups: new Set([]),
      filterText: '',

      ...persisted
    };
  },

  getStateToPersist(savingToLocalStorage) {
    return {
      ...this.state,
      filterText: savingToLocalStorage ? '' : this.state.filterText
    };
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.groupBy !== this.state.groupBy) {
      this.setState({
        expandedGroups: new Set([])
      });
    }
  },

  _findGroups() {
    var groups = [];

    function search(children) {
      React.Children.forEach(children, (child) => {
        if (child.type === Column) {
          if (child.props.groupable) {
            groups.push({
              label: child.props.label,
              value: child.props.dataKey
            });
          }
        }

        search(child.children);
      });
    }

    search(this.props.children);

    return groups;
  },

  _handleGroupByChange(e) {
    var val = e.target.value;

    if (val === 'null') {
      this.setState({
        groupBy: null
      });
    } else {
      this.setState({
        groupBy: val
      });
    }
  },

  _renderGroupBy() {
    var groups = this._findGroups();
    var id = _.uniqueId();
    return <div className="form-group">
      <label htmlFor={id} style={{marginRight: '5px'}}>
        Group By
      </label>
      <select
        style={{marginRight: '5px'}}
        value={this.state.groupBy + ''}
        onChange={this._handleGroupByChange}
        id={id}
        className="form-control">
        <option value="null">None</option>
        { groups.map(group => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))
        }
      </select>
    </div>;
  },

  _groupingColumnCellRenderer(cell, dataKey, row) {
    var iconName;

    if (row.get('__isGroupingRow') !== true) {
      return <div className="text-muted">
        {cell}
      </div>;
    }

    iconName = (this.state.expandedGroups.includes(cell)) ?
      'chevron-up' : 'chevron-down';

    return <div>
      {cell}
      {' (' + row.get('__groupingRowCount') + ') '}
      <Icon name={iconName} className="pull-right"/>
    </div>;
  },

  _rowClickHandler(e, i, row) {
    var expanded = this.state.expandedGroups;
    var group;
    var plainRow = row.toJS ? row.toJS() : row;

    if (!this.state.groupBy || plainRow.__isGroupingRow !== true) {
      return this.props.onRowClick(e, i, row);
    }

    e.preventDefault();

    group = plainRow[this.state.groupBy];

    if (expanded.includes(group)) {
      this.setState({
        expandedGroups: expanded.remove(group)
      });
    } else {
      this.setState({
        expandedGroups: expanded.add(group)
      });
    }
  },

  _processColumnChildren(children) {
    return React.Children.map(children, child => {
      if (child.type !== Column) {
        return React.cloneElement(child, {
          children: this._processColumnChildren(child.children)
        });
      }

      if (child.props.dataKey !== this.state.groupBy) {
        return child;
      }

      return React.cloneElement(child, {
        fixed: true,
        required: true,
        cellRenderer: this._groupingColumnCellRenderer
      });
    });
  },

  _filterFunction(filterText, row) {
    var values;

    values = row.toArray();

    for (let i = 0, n = values.length; i < n; i++) {
      const val = values[i];
      const type = typeof values[i];
      let strVal;

      if (type !== 'string' && type !== 'number') {
        continue;
      }

      strVal = (val + '').toLowerCase();
      if (strVal.search(filterText) !== -1) {
        return true;
      }
    }

    return false;
  },

  _processData(data) {
    var processedData;
    var group = null;
    var key = this.state.groupBy;
    var {filterText} = this.state;
    var filteredLength;

    if (key === null) {
      return {
        data: data,

        // let Datatable compute this on its own
        totalDataSize: undefined,
        filteredDataSize: undefined
      };
    }

    processedData = data.sort((rowA, rowB) => {
      var valA = rowA.get(key) + '';
      var valB = rowB.get(key) + '';
      if (valA > valB) {
        return 1;
      } else if (valA < valB) {
        return -1;
      }
      return 0;
    });

    if (filterText !== '') {
      processedData = processedData.filter(
        this._filterFunction.bind(this, filterText.toLowerCase())
      );
    }

    filteredLength = processedData.size;

    processedData = processedData.reduce((accumulated, current, i) => {
      var acc = accumulated;

      if (group !== current.get(key)) {
        group = current.get(key);
        acc = acc.push(this._createGroupingRow(key, current, i, processedData));
      }

      if (this.state.expandedGroups.includes(current.get(key))) {
        acc = acc.push(current);
      }

      return acc;
    }, new List([]));

    return {
      data: processedData,
      totalDataSize: data.size,
      filteredDataSize: filteredLength
    };
  },

  _createGroupingRow(groupBy, firstRow, i, fullList) {
    var j = i;
    var rowCount = 0;
    var groupingValue = firstRow.get(groupBy);
    var keys = Object.keys(firstRow.toObject());
    var row = keys.reduce((obj, key) => {
      if (key === groupBy) {
        return obj.set(key, groupingValue);
      }

      return obj.set(key, '');
    }, new Map({}));

    while (j < fullList.size &&
           fullList.get(j).get(groupBy) === groupingValue) {
      rowCount++;
      j++;
    }

    return (
      row.set('__isGroupingRow', true)
         .set('__groupingRowCount', rowCount)
    );
  },

  _handleFilterChange(value) {
    this.setState({
      filterText: value
    });
  },

  _rowClassNameGetter(data, i) {
    if (this.state.groupBy === null) {
      return '';
    }

    if (data.get(i).get('__isGroupingRow') === true) {
      return styles.groupingRow;
    }

    return '';
  },

  _rowHeightGetter(data, i) {
    var row;
    row = data.get(i);
    if (row && row.get('__isGroupingRow') === true) {
      return 60;
    }

    return this.props.rowHeight;
  },

  render() {
    const {groupBy} = this.state;
    let data = this.props.data;

    if (Array.isArray(data)) {
      data = Immutable.fromJS(data);
      /* eslint-disable */
      console.log(
        `GroupableDataTable "${this.props.title}" was passed a native` +
        ` Js array to its 'data' field. For the best performace, store your data ` +
        `in an Immutable.List of Immutable.Map objects.`
      );
      /* eslint-enable */
    }

    const processed = this._processData(data);
    const props = {
      ...this.props,

      data: processed.data,
      totalDataSize: processed.totalDataSize,
      filteredDataSize: processed.filteredDataSize,

      onRowClick: this._rowClickHandler,
      children: this._processColumnChildren(this.props.children),
      renderInlineFormControls: this._renderGroupBy,
      sortable: groupBy === null,
      onFilterTextChange: this._handleFilterChange,
      filterText: this.state.filterText,
      runInternalFilterFunction: groupBy === null,
      rowClassNameGetter: this._rowClassNameGetter.bind(this, processed.data),
      rowHeightGetter: this._rowHeightGetter.bind(this, processed.data),
      persistStateKey: this.props.persistStateKey ?
        this.props.persistStateKey + '__dataTable' : undefined
    };

    return <Table {...props}/>;
  }
});

export default GroupableDatatable;
