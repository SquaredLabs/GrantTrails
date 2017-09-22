import { observable, computed, action, runInAction, reaction } from 'mobx'

import FilterState from 'stores/FilterState'
import LocationStore from 'stores/LocationStore'
import PointStore from 'stores/PointStore'

class UiState {
  @observable.ref map = null

  @observable userIsViewingAbout = true
  @observable userIsViewingFilters = false

  @observable mapDidLoad = false
  @observable mapDidError = false
  @observable.ref selectedLocation = null

  constructor () {
    reaction(
      () => FilterState.search,
      () => { this.selectedLocation = null },
      { name: 'reset selected location on search' }
    )
  }

  @computed get showSpinner () {
    return !this.mapDidError && (PointStore.isFetching || !this.mapDidLoad)
  }

  @computed get showError () {
    // Right now, the error message only handles errors with loading.
    return !this.mapDidLoad && this.mapDidError
  }

  @action async selectLocationFromMap (id) {
    // Clear search results if a valid point was selected from the map. This
    // was requested by Dan with the rationale that the sidebar search and map
    // search should be mutually exclusive. You can search using one or the
    // other but it doesn't make sense to do both.
    if (PointStore.isIdVisibleOnMap(id)) {
      FilterState.search = ''
    }

    if (!LocationStore.locations.has(id)) {
      // We only have the id for now. Once we do the AJAX request, we can populate
      // selectedLocation with full information from the backend.
      const [ longitude, latitude ] = PointStore.filtered.features
        .filter(x => x.properties.id === id)[0].geometry.coordinates
      this.selectedLocation = { id, longitude, latitude }
    }

    const location = await LocationStore.fetchSingleLocation(id)
    runInAction('selectLocationFromMap', () => {
      this.selectedLocation = location
    })
  }

  listenForMapReactions () {
    if (this.disposer) return

    this.disposer = reaction(
      () => FilterState.query,
      async () => {
        const points = await PointStore.fetchPoints()
        this.map.getSource('points').setData(points)
      },
      { name: 'update map points for change in filters' }
    )
  }
}

let singleton = new UiState()
export default singleton
