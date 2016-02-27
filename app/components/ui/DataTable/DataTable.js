/*

  Wraps Facebook's Fixed Data Table
  https://github.com/facebook/fixed-data-table

  Uses Zynga Scroller for scrolling on touch devices

 */

import React from 'react';
import {Column} from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.css';
import _ from 'underscore';
import $ from 'jquery';
import cx from 'classnames';
import {ButtonDropdown} from './ButtonDropdown';
import Icon from '../Icon';
import PureRenderMixin from 'react-pure-render/mixin';
import DebouncedInput from './DebouncedInput';
import Immutable from 'immutable';
import PersistStateMixin from './PersistStateMixin';
import Tooltip from './Tooltip';
import DataTableChild from './DataTableChild';
import styles from './stylesheets/DataTable.less';

import {List} from 'immutable';

var templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var sortTypes = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export const DataTableParent = React.createClass({
  propTypes: {
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.instanceOf(List)
    ]).isRequired,

    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    rowHeight: React.PropTypes.number.isRequired,
    headerHeight: React.PropTypes.number.isRequired,

    defaultSortBy: React.PropTypes.string,
    defaultSortDirection: React.PropTypes.oneOf(_.keys(sortTypes)),
    renderFormControls: React.PropTypes.func,
    renderInlineFormControls: React.PropTypes.func,
    onRowClick: React.PropTypes.func,

    rowDataKey: React.PropTypes.string.isRequired,

    onSelectChange: React.PropTypes.func,
    selectable: React.PropTypes.bool,
    multi: React.PropTypes.bool,
    sortable: React.PropTypes.bool,

    // only required if you wish to control filtering from above
    filterText: React.PropTypes.string,
    onFilterTextChange: React.PropTypes.func,
    runInternalFilterFunction: React.PropTypes.bool,

    totalDataSize: React.PropTypes.number,
    filteredDataSize: React.PropTypes.number,

    selectableColumns: React.PropTypes.bool,

    title: React.PropTypes.string,

    // only applies if you pass a persistStateKey
    persistFilterText: React.PropTypes.bool,

    simple: React.PropTypes.bool
  },

  mixins: [PureRenderMixin, PersistStateMixin],

  getDefaultProps: () => ({
    selectable: false,
    multi: true,
    selectableColumns: true,
    sortable: true,
    runInternalFilterFunction: true,
    renderFormControls: () => {},
    renderInlineFormControls: () => {},
    defaultSortBy: null,
    defaultSortDirection: sortTypes.DESC,
    rowClassNameGetter: () => '',
    onSelectChange: () => {},
    persistFilterText: true,
    simple: false
  }),

  getInitialState() {
    var dimensions = this._getContainerSize();
    var persisted = this.getPersistedState();

    if (persisted.selectedRows) {
      persisted.selectedRows = new Immutable.Set(persisted.selectedRows);
    }

    if (persisted.filterText && !this.props.persistFilterText) {
      delete persisted.filterText;
    }

    return {
      filterText: '',
      sortBy: this.props.defaultSortBy,
      sortDirection: this.props.defaultSortDirection,
      hiddenColumns: [],
      selectedRows: new Immutable.Set([]),
      lastSelectedRowIndex: null,


      ...persisted,

      maxHeight: dimensions.height,
      containerWidth: dimensions.width,

      selectedTmpl: _.template('{{ n }} selected', templateSettings),

      showingTmpl: _.template('Showing {{ filtered }} of {{ total }}', templateSettings)
    };
  },

  getStateToPersist(savingToLocalStorage) {
    return {
      ...this.state,
      filterText: savingToLocalStorage ? '' : this.state.filterText
    };
  },

  componentWillMount() {
    this.__cachedProcessedData = null;
  },

  componentDidMount() {
    this._setContainerSize();
    this._interval = setInterval(this._setContainerSize, 1000);
  },

  componentWillUnmount() {
    clearInterval(this._interval);
  },

  componentWillReceiveProps(nextProps) {
    if (this._getLength(nextProps.data) !==
        this._getLength(this.props.data)) {
      const set = new Immutable.Set([]);
      this.setState({
        selectedRows: set,
        lastSelectedRowIndex: null
      });
      this.props.onSelectChange(set);
    }
  },

  _processData(data, state) {
    var newData = data;
    if (data.toArray !== undefined) {
      newData = data.toArray();
    }

    newData = (!this.props.runInternalFilterFunction ||
               this._getFilterText() === '') ? newData
      : this._filteredData(newData);

    if (state.sortBy !== null && this.props.sortable) {
      newData = newData.sort(
        this._sortFunction.bind(this, state)
      );
    }

    this.__cachedProcessedData = newData;

    return newData;
  },

  _getFilterText() {
    if (this.props.filterText !== undefined) {
      return this.props.filterText;
    }

    return this.state.filterText;
  },

  _getContainerSize() {
    var $container;
    var width = this.props.width;
    var height = $(window).height() - 210;

    if (this.isMounted()) {
      $container = $(React.findDOMNode(this.refs.gridRow));
      width = $container.width();
    }

    return {
      width: width,
      height: height
    };
  },

  _setContainerSize() {
    var {width, height} = this._getContainerSize();

    if (width !== this.state.containerWidth ||
        height !== this.state.maxHeight) {
      this.setState({
        containerWidth: width,
        maxHeight: height
      });
    }
  },

  _handleRowClick(e, i, row) {
    var lastIndex = this.state.lastSelectedRowIndex;

    if (this.props.onRowClick) {
      this.props.onRowClick(e, i, row);
    }

    if (!e.defaultPrevented && this.props.selectable) {
      // e.stopPropagation();
      // e.preventDefault();

      if (!e.shiftKey || lastIndex === null || this.props.multi === false) {
        this._toggleRow(row, i, e);
      } else {
        this._toggleRowsInRange(lastIndex, i);
      }
    }
  },

  _getDataKey(row) {
    return row.toJS ?
      row.get(this.props.rowDataKey) :
      row[this.props.rowDataKey];
  },

  _toggleRow(row, i, e) {
    var val = this._getDataKey(row);
    var {selectedRows} = this.state;
    var lastIndex = null;
    var alreadySelected = selectedRows.has(val);

    if ((e.ctrlKey || e.altKey || e.metaKey) && this.props.multi) {
      if (alreadySelected) {
        selectedRows = selectedRows.remove(val);
        lastIndex = this.state.lastSelectedRowIndex;
      } else {
        selectedRows = selectedRows.add(val);
        lastIndex = i;
      }
    } else if (selectedRows.size > 1) {
      selectedRows = selectedRows.filter(x => x === val);
      lastIndex = i;
      if (!alreadySelected) {
        selectedRows = selectedRows.add(val);
      }
    } else if (selectedRows.size === 1 && !alreadySelected) {
      selectedRows = new Immutable.Set([val]);
      lastIndex = i;
    } else if (alreadySelected) {
      selectedRows = selectedRows.clear();
    } else {
      selectedRows = selectedRows.add(val);
      lastIndex = i;
    }

    this.setState({
      selectedRows: selectedRows,
      lastSelectedRowIndex: lastIndex
    });

    this.props.onSelectChange(selectedRows);
  },

  _toggleRowsInRange(startIndex, endIndex) {
    var set = this.state.selectedRows;
    var cachedData = this.__cachedProcessedData;
    var toggleOn = false;

    var start = startIndex;
    var end = endIndex;

    if (cachedData === null) {
      throw new Error('Datatable: __cachedProcessedData is still null');
    }

    if (start > end) {
      start = endIndex;
      end = startIndex;
    }

    if (!set.has(this._getDataKey(cachedData[endIndex]))) {
      toggleOn = true;
    }

    if (toggleOn) {
      set = set.withMutations((selectedRows) => {
        for (let i = start, n = end; i <= n; i++) {
          const key = this._getDataKey(cachedData[i]);
          selectedRows.add(key);
        }
      });
    } else {
      const keysToRemove = [];
      for (let i = start, n = end; i <= n; i++) {
        const key = this._getDataKey(cachedData[i]);
        keysToRemove.push(key);
      }

      set = set.filter((key) => {
        return keysToRemove.indexOf(key) === -1;
      });
    }

    this.setState({
      selectedRows: set,
      lastSelectedRowIndex: endIndex
    });

    this.props.onSelectChange(set);
  },

  _handleFilterChange(value) {
    this.setState({
      selectedRows: new Immutable.Set([]),
      lastSelectedRowIndex: null
    });

    if (this.props.onFilterTextChange) {
      this.props.onFilterTextChange(value);
    } else {
      this.setState({
        filterText: value
      });
    }
  },

  _filteredData(data) {
    var filter = this._getFilterText().toLowerCase();
    return data.filter(item => {
      var values;

      if (!item) return false;

      values = _.values((item.toObject) ? item.toObject() : item);

      if (item.__isGroupingRow === true) {
        return true;
      }

      for (let i = 0, n = values.length; i < n; i++) {
        let value = values[i];
        if (typeof value === 'number') {
          value = value + '';
        }
        if (!values || !_.isString(value)) continue;

        value = values[i].toString().toLowerCase();
        if (value.search(filter) !== -1) {
          return true;
        }
      }

      return false;
    });
  },

  _sortRowsBy(dataKey, e) {
    var sortDirection = this.state.sortDirection;

    if (this.state.sortBy === dataKey) {
      if (sortDirection === sortTypes.ASC) {
        sortDirection = sortTypes.DESC;
      } else {
        sortDirection = sortTypes.ASC;
      }
    }

    e.preventDefault();
    e.stopPropagation();

    this.setState({
      sortBy: dataKey,
      sortDirection: sortDirection,
      selectedRows: new Immutable.Set([]),
      lastSelectedRowIndex: null
    });
  },


  _sortFunction(state, rowA, rowB) {
    var {sortBy, sortDirection} = state;
    var immutable = !!rowA.toJS;
    var valA = (immutable ? rowA.get(sortBy) : rowA[sortBy]);
    var valB = (immutable ? rowB.get(sortBy) : rowB[sortBy]);
    var ret = 0;

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
    } else {
      valA = String(valA);
      valA = valA.toLowerCase();
    }

    if (typeof valB === 'string') {
      valB = valB.toLowerCase();
    } else {
      valB = String(valB);
      valB = valB.toLowerCase(valB);
    }

    if (valA > valB) {
      ret = 1;
    }
    if (valB > valA) {
      ret = -1;
    }

    if (sortDirection === sortTypes.DESC) {
      ret = ret * -1;
    }

    return ret;
  },

  _getColumns() {
    var columns = [];

    function search(children) {
      React.Children.forEach(children, child => {
        if (child.type === Column) {
          columns.push(child);
        }

        search(child.props.children);
      });
    }

    search(this.props.children);

    return columns;
  },

  _onColumnSelect(dataKey, e) {
    var {hiddenColumns} = this.state;

    e.stopPropagation();

    if (!e.target.checked && hiddenColumns.indexOf(dataKey) === -1) {
      this.setState({
        hiddenColumns: [...hiddenColumns, dataKey]
      });
    } else if (e.target.checked && hiddenColumns.indexOf(dataKey) >= 0) {
      hiddenColumns.splice(hiddenColumns.indexOf(dataKey), 1);
      this.setState({
        hiddenColumns: hiddenColumns.slice()
      });
    }
  },

  _defaultCellRenderer(cellText) {
    return <span>{cellText}</span>;
  },

  _cellRenderer(cellRenderer, ...args) {
    var cell;
    var containerClassName = 'public_fixedDataTableCell_cellContent';
    var style = {};
    var [, , row] = args;
    if (!cellRenderer) {
      cell = this._defaultCellRenderer(...args);
    } else {
      cell = cellRenderer(...args);
    }

    if (this.state.selectedRows.has(this._getDataKey(row))) {
      containerClassName = cx(containerClassName, styles.selectedRow);
      style = {
        height: this.props.rowHeight
      };
    }

    return <div className={containerClassName} style={style}>
      {cell}
    </div>;
  },

  _immutableCellDataGetter(key, row) {
    return row.get(key);
  },

  _nonImmutableCellDataGetter(key, row) {
    return row[key];
  },

  _processColumnChildren(children) {
    var immutable = !!(this.props.data.toJS);
    return React.Children.map(children, (child) => {
      if (child.type === Column) {
        let dataGetter = child.props.cellDataGetter;
        if (this.state.hiddenColumns.indexOf(child.props.dataKey) >= 0 &&
            !child.props.required) {
          return null;
        }

        if (dataGetter === undefined) {
          dataGetter = immutable ?
            this._immutableCellDataGetter : this._nonImmutableCellDataGetter;
        }

        return React.cloneElement(child, {
          headerRenderer: (this.props.sortable && !child.props.headerRenderer) ?
              (...args) => this._renderTableHeader(...args)
            :
              child.props.headerRenderer,
          cellRenderer: this.props.selectable ?
              this._cellRenderer.bind(this, child.props.cellRenderer)
            :
              child.props.cellRenderer,
          cellDataGetter: dataGetter
        });
      }

      return React.cloneElement(child, {
        children: this._processColumnChildren(child.children)
      });
    });
  },

  _handleFormSubmit(e) {
    e.preventDefault();
  },

  _selectAllColumns(e) {
    e.stopPropagation();
    this.setState({
      hiddenColumns: []
    });
  },

  _selectNoColumns(e) {
    e.stopPropagation();
    this.setState({
      hiddenColumns:
        this._getColumns()
          .filter(col => col.props.label && !col.props.required)
          .map(col => col.props.dataKey)
    });
  },

  _renderTableHeader(label, cellDataKey) {
    var iconName = (this.state.sortDirection === sortTypes.ASC) ?
      'sort-up' : 'sort-down';

    var clickHandler = this._sortRowsBy.bind(this, cellDataKey);

    if (!label) {
      return <div/>;
    }

    return (
      <div role="button" onClick={clickHandler} onTouchEnd={clickHandler}>
        {label}
        { ' ' }
        { this.state.sortBy === cellDataKey &&
          <Icon name={iconName} className="pull-right"/>
        }
      </div>
    );
  },

  _renderColumnSelectDropdown() {
    var selectRow = <span>
      <span
        role="button"
        className={styles.columnSelectAllLabel}
        onClick={this._selectAllColumns}>
        Select All
      </span>
      <span
        role="button"
        className={styles.columnSelectAllLabel}
        onClick={this._selectNoColumns}>
        Select None
      </span>
    </span>;

    return [selectRow].concat(
      this._getColumns().filter(col => col.props.label).map(col => {
        var {dataKey} = col.props;
        return (
          <a
            className={styles.columnSelectLink}>
            <label>
              <input
                type="checkbox"
                disabled={!!col.props.required}
                onChange={this._onColumnSelect.bind(this, dataKey)}
                checked={
                  this.state.hiddenColumns.indexOf(dataKey) === -1 ||
                  !!col.props.required
                }/>
              <span className={styles.columnSelectLabel}>
                {col.props.label}
              </span>
            </label>
          </a>
        );
      })
    );
  },

  _renderShowing({ totalLength, filteredLength }) {
    return this.state.showingTmpl({
      filtered: filteredLength,
      total: totalLength
    });
  },

  _renderSelected() {
    return this.state.selectedTmpl({
      n: this.state.selectedRows.size
    });
  },

  _renderForm() {
    var filterText = this._getFilterText();

    return (
      <form
        className={cx('form-inline', styles.form)}
        onSubmit={this._handleFormSubmit}>

        { this.props.title &&
          <span className={styles.pullLeftDesktop}>
            <div className="form-group">
              <h4 className={styles.title}>{this.props.title}</h4>
            </div>
          </span>
        }

        <span className={styles.pullRightDesktop}>

          <div className={cx('form-group', styles.marginRight)}>
            <div className="input-group">
              <label className="input-group-addon" htmlFor="datatable-search">
                <Icon name="search"/>
              </label>
              <DebouncedInput
                id="datatable-search"
                autoSelect
                placeholder="Search"
                type="search"
                className="form-control"
                value={filterText}
                onChange={this._handleFilterChange}/>
            </div>
          </div>

          { this.props.renderInlineFormControls() }

          { this.props.selectableColumns &&
            <div className={cx('form-group', styles.marginRight)}>
              <ButtonDropdown
                tooltipContent="Select which columns are visible"
                right
                caret={false}
                renderList={this._renderColumnSelectDropdown}
                adaptStyle="icon-dark"
                wrapperClassName="pull-right">
                <Icon name="bars" className="fa-rotate-90"/>
              </ButtonDropdown>
            </div>
          }
        </span>
      </form>
    );
  },

  _getLength(dataSet) {
    return dataSet.size !== undefined ?
      dataSet.size :
      dataSet.length;
  },

  _rowClassNameGetter(...args) {
    var i = args[0];
    return cx(
      styles.row,
      i % 2 === 0 ? styles.rowEven : styles.rowOdd,
      this.props.selectable && styles.selectableRow,
      this.props.rowClassNameGetter(...args));
  },

  render() {
    var width = this.state.containerWidth === null ?
      this.props.width :
      Math.min(this.props.width, this.state.containerWidth);

    var height;
    var totalDataSize;
    var filteredDataSize;

    var data = this._processData(this.props.data, this.state);

    height = Math.min(this.state.maxHeight,
                      this.props.height);

    totalDataSize = (this.props.totalDataSize !== undefined) ?
        this.props.totalDataSize
      :
        this._getLength(this.props.data);

    filteredDataSize = (this.props.filteredDataSize !== undefined) ?
        this.props.filteredDataSize
      :
        data.length;


    return (
      <span className={styles.base}>
        <div className={cx('row', styles.formRow)}>
          <div className="col-md-12">
            {
              this._renderForm()
            }
          </div>
        </div>

        <div className={cx('row', styles.formControlsRow)}>
          <div className="col-md-12">
            <div className="pull-right">
              { this.props.renderFormControls() }
            </div>
          </div>
        </div>

        <div className={cx('row', styles.gridRow)} ref="gridRow">
          <div ref="container" className={cx(styles.container)}>
            <DataTableChild
              {...this.props}
              rowClassNameGetter={this._rowClassNameGetter}
              width={width}
              height={height}
              rowGetter={i => data[i]}
              rowsCount={data.length}
              onRowClick={this._handleRowClick}>
              {this._processColumnChildren(this.props.children)}
            </DataTableChild>
          </div>
        </div>

        <div className={cx('row', styles.footerRow)}>
          <div className="col-md-12">
            <span className={styles.marginRight}>
              {
                this._renderShowing({
                  totalLength: totalDataSize,
                  filteredLength: filteredDataSize
                })
              }
            </span>
            { this.props.selectable ?
                this._renderSelected()
              :
                ''
            }
          </div>
        </div>

      </span>
    );
  }
});

export function renderTruncate(cell, dataKey, row, i, columnData, width) {
  return <Tooltip content={cell + ''}>
    <div style={{
      maxWidth: (width - 16) + 'px',
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      position: 'relative'
    }}>
      {cell}
    </div>
  </Tooltip>;
}
