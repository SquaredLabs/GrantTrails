import 'babel-polyfill'

import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import h from 'h'

import Container from 'container'

import UiState from 'stores/UiState'
import FilterState from 'stores/FilterState'
import LocationStore from 'stores/LocationStore'
import PointStore from 'stores/PointStore'

const stores = {
  UiState,
  FilterState,
  LocationStore,
  PointStore
}

render(h(Provider, stores, h(Container)), document.getElementById('root'))
