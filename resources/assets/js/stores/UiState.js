import { observable, computed, action, runInAction, reaction } from 'mobx'

import FilterState from 'stores/FilterState'
import LocationStore from 'stores/LocationStore'
import PointStore from 'stores/PointStore'

class UiState {
  @observable.ref map = null

  // Only show the site description on load when
  // the user has wide enough room for it.
  @observable userIsViewingAbout = window.innerWidth > 640
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

    // It's unlikely someone will want to view the about pane and search results
    // at the same time, so we'll close the about pane to save vertical space
    // and prevent it from moving so much as results come in.
    reaction(
      () => FilterState.search,
      () => { this.userIsViewingAbout = false },
      { name: 'close about pane when searching' }
    )
  }

  @computed get showSpinner () {
    return !this.mapDidError && (PointStore.isFetching || !this.mapDidLoad)
  }

  @computed get showError () {
    // Right now, the error message only handles errors with loading.
    return !this.mapDidLoad && this.mapDidError
  }

  flyToSelectedLocation () {
    // There isn't a quick and easy way to get the default font size, so we'll
    // assume it's 16.
    const approximateSidebarSize = 26 * 16
    const sidebarIsAboveInsteadOfOnLeft = window.innerWidth < approximateSidebarSize

    // If the window width is smaller than the size of the sidebar, we do
    // not want to shift since the user is clicking on locations below the map
    const offset = !sidebarIsAboveInsteadOfOnLeft
      // Offset describes how much to shift the center by. Since we have a
      // sidebar on the left, we want our offset to be half of the sidebar's
      // width. We also shift 30 pixels up since it looks a bit better.
      ? [ document.querySelector('.sidebar').offsetWidth / 2, -30 ]
      : [0, 50]

    this.map.flyTo({
      // Don't zoom the user out, cause that can be annoying.
      zoom: Math.max(this.map.getZoom(), 9),
      center: [
        this.selectedLocation.longitude,
        this.selectedLocation.latitude
      ],
      offset
    })
  }

  @action async selectLocation (id) {
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

  @action async selectLocationFromMap (id) {
    // Clear search results if a valid point was selected from the map. This
    // was requested by Dan with the rationale that the sidebar search and map
    // search should be mutually exclusive. You can search using one or the
    // other but it doesn't make sense to do both.
    if (PointStore.isIdVisibleOnMap(id)) {
      FilterState.search = ''
    }

    await this.selectLocation(id)

    if (this.map.getZoom() < 9) {
      this.flyToSelectedLocation()
    }
  }

  @action async selectLocationFromSidebar (id) {
    await this.selectLocation(id)
    this.flyToSelectedLocation()
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
