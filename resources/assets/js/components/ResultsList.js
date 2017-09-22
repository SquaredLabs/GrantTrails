import React from 'react'
import h from 'h'

import LocationCell from 'components/LocationCell'

export default class Results extends React.Component {
  render () {
    const { matchedLocations, selectedLocation } = this.props

    return h('ul', null,
      matchedLocations.map(location =>
        h(LocationCell, {
          key: location.id,
          location,
          selected: selectedLocation && selectedLocation.id === location.id
        })))
  }
}
