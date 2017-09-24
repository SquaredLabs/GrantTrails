import { observable, computed, action, reaction, runInAction } from 'mobx'
import get, { getSingle } from 'transport/location'

import FilterState from 'stores/FilterState'

class LocationStore {
  @observable.shallow locations = new Map()
  @observable requestsCounter = 0
  @observable lastFetchDidError = false
  @observable lastFetchHadNoResults = false

  @observable searchResults = []

  constructor () {
    this.disposer = reaction(
      () => FilterState.search,
      () => this.fetchLocations(),
      {
        name: 'react to changes in search',
        delay: 500
      }
    )
  }

  @action resetSearchResults () {
    this.searchResults = []
  }

  @computed get matchedLocations () {
    return this.searchResults.map(i => this.locations.get(i))
  }

  @computed get isFetching () {
    return this.requestsCounter > 0
  }

  @action async fetchSingleLocation (id) {
    if (this.locations.has(id)) {
      return this.locations.get(id)
    }

    this.requestsCounter++

    try {
      const response = await getSingle(id)
      var location = await response.json()
    } catch (e) {
      console.error(e)
      this.lastFetchDidError = true
      this.requestsCounter--
      return
    }

    runInAction('fetchSingleLocation', () => {
      this.locations.set(location.id, location)
      this.requestsCounter--
    })

    return location
  }

  @action async fetchLocations () {
    this.resetSearchResults()

    if (FilterState.search === '') {
      this.lastFetchDidError = false
      this.lastFetchHadNoResults = false
      return
    }

    this.requestsCounter++

    try {
      const response = await get({ search: FilterState.search })
      var json = await response.json()
      this.lastFetchDidError = false
    } catch (e) {
      console.error(e)
      this.lastFetchDidError = true
      this.requestsCounter--
      return
    }

    runInAction('fetchLocations', () => {
      // fetchLocations can run multiple times asynchronously, so our
      // original results array that was cleared could now have populated items.
      // Clear these again to make sure we have only the latest data displayed.
      this.resetSearchResults()

      this.addFetchLocationsToSearchResults(json)
      this.requestsCounter--
    })
  }

  addFetchLocationsToSearchResults (json) {
    this.lastFetchHadNoResults = json.length === 0

    for (const location of json) {
      this.locations.set(location.id, location)
      this.searchResults.push(location.id)
    }
  }
}

let singleton = new LocationStore()
export default singleton
