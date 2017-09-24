import React from 'react'
import { autorun } from 'mobx'
import { inject, observer } from 'mobx-react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import h from 'h'

import { TILESERVER_URL, colors } from 'config'

import mapboxgl from 'mapbox-gl'
import Spinner from 'components/Spinner'
import MapLoadError from 'components/MapLoadError'

@inject('UiState', 'FilterState', 'PointStore') @observer
export default class Map extends React.Component {
  async componentDidMount () {
    const { UiState, PointStore } = this.props

    const defaultMapboxSettings = {
      container: this.container,
      style: `${TILESERVER_URL}/styles/positron/style.json`,
      center: [-73.0877, 41.6032],
      zoom: 8,
      attributionControl: false
    }

    const smallResolutionSettings = {
      center: [-72.700, 41.9032],
      zoom: 7
    }

    UiState.map = new mapboxgl.Map(window.innerWidth > 640
      ? defaultMapboxSettings
      : { ...defaultMapboxSettings, ...smallResolutionSettings })

    UiState.map.addControl(new mapboxgl.NavigationControl())
    UiState.map.addControl(new mapboxgl.AttributionControl({ compact: true }))

    UiState.map.on('error', e => {
      console.error(e)
      UiState.mapDidError = true
    })

    autorun('update map coordinates for new location', () => {
      if (!UiState.selectedLocation) {
        if (UiState.mapDidLoad) {
          UiState.map.setPaintProperty('points', 'circle-stroke-width', 0)
        }
        return
      }

      UiState.map.setPaintProperty('points', 'circle-stroke-color', {
        property: 'id',
        type: 'categorical',
        stops: [ [ UiState.selectedLocation.id, colors.selected ] ]
      })

      UiState.map.setPaintProperty('points', 'circle-stroke-width', {
        property: 'id',
        type: 'categorical',
        stops: [ [ UiState.selectedLocation.id, 2 ] ],
        default: 0
      })

      // Allow highlighting of location before we zoom into it.
      if (!UiState.selectedLocation.longitude || !UiState.selectedLocation.latitude) {
        return
      }

      UiState.map.flyTo({
        // Don't zoom the user out, cause that can be annoying.
        zoom: Math.max(UiState.map.getZoom(), 9),
        center: [
          UiState.selectedLocation.longitude,
          UiState.selectedLocation.latitude
        ],
        // Offset describes how much to shift the center by. Since we have a
        // sidebar on the left, we want our offset to be half of the sidebar's
        // width. We also shift 30 pixels up since it looks a bit better.
        offset: [ document.querySelector('.sidebar').offsetWidth / 2, -30 ]
      })
    })

    const addMapReactionListener = data => {
      if (data.sourceId === 'points' && data.isSourceLoaded) {
        UiState.mapDidLoad = true
        UiState.listenForMapReactions()
        UiState.map.off('data', addMapReactionListener)
      }
    }
    // The dataend event would be better to listen to once it's implemented.
    // https://github.com/mapbox/mapbox-gl-js/issues/1715
    UiState.map.on('data', addMapReactionListener)

    UiState.map.on('load', () => this.addMapClickListener())

    const points = await PointStore.fetchPoints()
    if (UiState.map.loaded()) {
      this.loadPointsForFirstTime(points)
    } else {
      UiState.map.on('load', () => this.loadPointsForFirstTime(points))
    }
  }

  loadPointsForFirstTime (points) {
    const { UiState } = this.props

    // Have state labels show above points
    const layerAfter = 'place_state'

    UiState.map.addLayer({
      'id': 'points',
      'type': 'circle',
      'source': {
        'type': 'geojson',
        'data': points
      },
      'paint': {
        'circle-radius': {
          'property': 'total',
          'stops': [
            [500, 3],
            [10000, 6],
            [200000, 8],
            [800000, 12],
            [1800000, 18],
            [32000000, 25]
          ]
        },
        'circle-color': colors.defaultPoint,
        'circle-opacity': {
          'property': 'transactions',
          'stops': [
            [1, 0.3],
            [1000, 0.7],
            [10000, 1]
          ]
        }
      }
    }, layerAfter)
  }

  addMapClickListener () {
    const { UiState } = this.props
    UiState.map.on('click', e => {
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]
      const features = UiState.map.queryRenderedFeatures(bbox, { layers: ['points'] })
      const firstFeature = features && features[0]
      if (firstFeature) {
        UiState.selectLocationFromMap(firstFeature.properties.id)
      }
    })
  }

  render () {
    const { UiState } = this.props

    return h('div', { id: 'map', ref: ref => { this.container = ref } },
      h(CSSTransitionGroup, {
        transitionName: 'fade',
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 500,
        children: [
          UiState.showSpinner && h('div', {
            key: 'spinner',
            className: 'absolute-center-container',
            children: h(Spinner)
          }),
          UiState.showError && h(MapLoadError, { key: 'error' })
        ]
      }))
  }
}
