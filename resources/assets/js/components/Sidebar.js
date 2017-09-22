import React from 'react'
import { inject, observer } from 'mobx-react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'

import h from 'h'

import AboutPane from 'components/AboutPane'
import SearchBox from 'components/SearchBox'
import Results from 'components/Results'
import FilterPane from 'components/FilterPane'
import ExpandButton from 'components/ExpandButton'
import ResultFromMap from 'components/ResultFromMap'

@inject('UiState') @observer
class AboutExpandButton extends React.Component {
  render () {
    const { UiState } = this.props

    return h(ExpandButton, {
      label: 'What am I looking at?',
      expanded: UiState.userIsViewingAbout,
      onClick: () => { UiState.userIsViewingAbout = !UiState.userIsViewingAbout }
    })
  }
}

@inject('UiState', 'FilterState') @observer
class FiltersExpandButton extends React.Component {
  render () {
    const { UiState, FilterState } = this.props

    const enabledHelperText = FilterState.numberOfFiltersEnabled > 0
      ? ` (${FilterState.numberOfFiltersEnabled} enabled)`
      : ''

    return h(ExpandButton, {
      label: 'Filters' + enabledHelperText,
      expanded: UiState.userIsViewingFilters,
      onClick: () => { UiState.userIsViewingFilters = !UiState.userIsViewingFilters }
    })
  }
}

@inject('UiState') @observer
export default class Sidebar extends React.Component {
  render () {
    const { UiState } = this.props
    const className = cn(
      'sidebar',
      { 'expand-width': UiState.userIsViewingFilters }
    )

    return h('div', { className, ref: 'container' },
      h(SearchBox),

      h('div', { className: 'about-pane-container' },
        h(AboutExpandButton),
        h(AnimateHeight, {
          duration: 300,
          height: UiState.userIsViewingAbout ? 'auto' : 0,
          children: h(AboutPane)
        })),

      h('div', { className: 'filters-container' },
        h(FiltersExpandButton),
        h(AnimateHeight, {
          duration: 200,
          height: UiState.userIsViewingFilters ? 'auto' : 0,
          children: h(FilterPane)
        })),

      h('div', { className: 'sidebar-body' },
        h(ResultFromMap),
        h(Results)
      )
    )
  }
}
