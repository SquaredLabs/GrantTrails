import React from 'react'
import { inject, observer } from 'mobx-react'
import h from 'h'
import { filters } from 'config'

import SegmentedOptions from 'components/SegmentedOptions'

@inject('FilterState') @observer
export default class FilterPane extends React.Component {
  render () {
    const { FilterState } = this.props

    return h('form', { className: 'filter-pane' },
      filters.map(({ name, type, options }) =>
        h('div', { key: name },
          h('span', { className: 'filter-label' }, name),
          h(SegmentedOptions, {
            mode: type || 'single',
            selected: FilterState.getSelectionsForGroup(name),
            onChange: options => FilterState.setFilterToOptions(name, options),
            options
          })
        )
      ))
  }
}
