import React from 'react'
import { inject, observer } from 'mobx-react'
import h from 'h'

@inject('FilterState') @observer
export default class SearchBox extends React.Component {
  render () {
    const { FilterState } = this.props

    return h('input', {
      className: 'search-box',
      placeholder: 'Search Places',
      value: FilterState.search,
      onChange: ev => { FilterState.search = ev.target.value }
    })
  }
}
