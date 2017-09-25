import React from 'react'
import h from 'h'

import SamHerbertLoader from 'components/SamHerbertLoader'

export default class extends React.Component {
  render () {
    const { isFetching, lastFetchDidError, lastFetchHadNoResults } = this.props

    return h('div', null,
      isFetching && h(SamHerbertLoader),
      !isFetching && lastFetchDidError && h(FetchError),
      !isFetching && !lastFetchDidError && lastFetchHadNoResults && h(NoResults))
  }
}

const FetchError = () =>
  h('div', { className: 'results-error' },
    'There was an error getting search results. Please try again later.')

const NoResults = () =>
  h('div', { className: 'results-error' },
    'Your search did not match any locations. You may enter a Connecticut city name or zip code.')
