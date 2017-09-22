import { observable, computed, action, runInAction } from 'mobx'
import fetch from 'isomorphic-fetch'

import UiState from 'stores/UiState'
import FilterState from 'stores/FilterState'

import { POINTS_ENDPOINT } from 'config'

class PointStore {
  @observable.shallow points = new Map()
  @observable requestsCounter = 0

  @computed get filtered () {
    return this.points.get(FilterState.query)
  }

  @computed get isFetching () {
    return this.requestsCounter > 0
  }

  @action async fetchPoints () {
    // Copy query to ensure it has the same value throughout the entire
    // execution of htis asynchronous function
    const query = FilterState.query

    if (this.points.has(query)) {
      const json = this.points.get(query)
      UiState.map.getSource('points').setData(json)
      return json
    }

    this.requestsCounter++
    try {
      const response = await fetch(POINTS_ENDPOINT + query)
      var json = await response.json()

      // Show CT points on top. This isn't how I'd like to do it if I had more
      // time, but it works and is quick. (But dirty.)
      json.features.sort((a, b) => a.properties.state === 'CT' ? 1 : -1)
    } finally {
      this.requestsCounter--
    }

    // This seems to work for now, but I'm not sure if it's guaranteed that
    // runInAction will finish in time if fetchPoints is await by some higher
    // order function.
    runInAction('fetchPoints', () => {
      this.points.set(query, json)
    })

    // Return json for quick retrieval by a HOC
    return json
  }

  isIdVisibleOnMap (id) {
    // This is one of the methods that could be faster with a dictionary of points
    return this.filtered.features.filter(x => x.properties.id === id).length > 0
  }
}

let singleton = new PointStore()
export default singleton
