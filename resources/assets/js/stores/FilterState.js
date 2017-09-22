import { observable, computed, action } from 'mobx'
import qs from 'qs'

import * as config from 'config'

class FilterState {
  @observable search = ''

  /*
   * Map all filters to false initially
   */
  @observable filters = config.filters
    .reduce((acc, el) => ({
      ...acc,
      [el.name]: el.options.reduce((acc, option) =>
        ({ ...acc, [option]: false }), {})
    }), {})

  /*
   * Set option to null to reset filter
   */
  @action setFilterToOptions (group, options) {
    Object.keys(this.filters[group])
      .filter(key => !options.includes(key))
      .forEach(key => { this.filters[group][key] = false })

    Object.keys(this.filters[group])
      .filter(key => options.includes(key))
      .forEach(key => { this.filters[group][key] = true })
  }

  getSelectionsForGroup (group) {
    return Object.keys(this.filters[group])
      .filter(key => this.filters[group][key])
  }

  @computed get enabledFilters () {
    const mapGroupToEnabledOptions = Object.keys(this.filters).reduce(
      (acc, group) => ({
        ...acc,
        [group]: Object.keys(this.filters[group])
          .filter(key => this.filters[group][key])
      })
    , {})

    return Object.keys(mapGroupToEnabledOptions).reduce(
      (acc, group) => mapGroupToEnabledOptions[group].length > 0
        ? { ...acc, [group]: mapGroupToEnabledOptions[group] }
        : acc
      , {})
  }

  @computed get numberOfFiltersEnabled () {
    return Object.keys(this.enabledFilters).length
  }

  @computed get query () {
    return Object.keys(this.enabledFilters).length > 0
      ? '?' + qs.stringify(this.enabledFilters)
      : ''
  }
}

let singleton = new FilterState()
export default singleton
