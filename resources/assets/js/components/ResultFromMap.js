/*
 * Sometimes a location is selected from the map that is not in the
 * current search results. In this scenario, we'll load a separate cell for this
 * specific item.
 */

import React from 'react'
import { inject, observer } from 'mobx-react'
import h from 'h'

import Accordion from 'components/Accordion'
import LocationCell from 'components/LocationCell'

@inject('LocationStore', 'UiState') @observer
export default class extends React.Component {
  render () {
    const { LocationStore, UiState } = this.props
    const { selectedLocation } = UiState
    const { searchResults } = LocationStore

    const fullLocationLoaded = selectedLocation && selectedLocation.id &&
      selectedLocation.longitude && selectedLocation.latitude && selectedLocation.city

    const selectedFromMap = fullLocationLoaded &&
      !searchResults.includes(UiState.selectedLocation.id)

    return h(Accordion, null,
      h('ul', null,
        selectedFromMap && h(LocationCell, {
          selected: true,
          location: selectedLocation
        })))
  }
}
