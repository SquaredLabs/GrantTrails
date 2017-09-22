import React from 'react'
import { inject, observer } from 'mobx-react'
import h from 'h'

import Accordion from 'components/Accordion'
import ResultsList from 'components/ResultsList'
import ResultsFetchIndicator from 'components/ResultsFetchIndicator'

/*
 * This component uses the Accordion, which means it cannot have any children
 * that update themselves. All updates to the results list and fetch indicator
 * must react through this component for the height to automatically update.
 */

@inject('LocationStore', 'UiState') @observer
export default class Results extends React.Component {
  render () {
    const { LocationStore, UiState } = this.props
    const { matchedLocations, isFetching, lastFetchDidError, lastFetchHadNoResults } = LocationStore
    const { selectedLocation } = UiState

    return h(Accordion, { className: 'results' },
      h(ResultsFetchIndicator, { isFetching, lastFetchDidError, lastFetchHadNoResults }),
      h(ResultsList, { matchedLocations, selectedLocation }))
  }
}
