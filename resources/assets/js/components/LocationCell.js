import React from 'react'
import { observer, inject } from 'mobx-react'
import h from 'h'
import cn from 'classnames'

import { numberWithCommas } from 'utils'
import SamHerbertLoader from 'components/SamHerbertLoader'

@inject('UiState', 'PointStore') @observer
export default class LocationCell extends React.Component {
  onClick () {
    const { UiState, location } = this.props
    UiState.selectLocationFromSidebar(location.id)
  }

  render () {
    const { PointStore, selected, location } = this.props

    // When filters are applied, the total transaction value we need to show for
    // the location should update to relect this change. This data is currently
    // in the GeoJSON payload that's returned from the PointsController on the
    // backend. For now, we'll grab it from that same payload. Perhaps there
    // may be a smarter way in the future to create a more general data
    // structure that both our application and mapbox-gl-js can use.

    const fetchedFilteredPoints = PointStore.filtered

    // TODO: Unfortunately, GeoJSON features are not keyed by any id; it is an
    // array. We're currently searching for the matching id, but this does not
    // scale. We should initialize a dictionary for quick constant time access
    // instead. Fixing this problem probably requires the same redesign as
    // above.
    const locationFromFilteredMap = fetchedFilteredPoints &&
      fetchedFilteredPoints.features.filter(x => x.properties.id === location.id)

    const total = locationFromFilteredMap && locationFromFilteredMap.length > 0
      ? locationFromFilteredMap[0].properties.total
      : 0

    return h('li', {
      className: cn('location-cell', { 'selected': selected }),
      onClick: () => this.onClick(),
      children: [
        h('span',
          h('span', { className: 'location-cell-city' },
            location.city),
          h('br'),
          h('span', { className: 'location-cell-zipcode' },
            `${location.zipcode} ${location.state}, ${location.country}`)),
        PointStore.isFetching
          ? h(SamHerbertLoader, { className: 'location-cell-loader' })
          : h('span', { className: 'location-cell-total' },
              '$' + numberWithCommas(total.toFixed(2)))
      ]
    })
  }
}
