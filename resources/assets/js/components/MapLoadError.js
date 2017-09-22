import h from 'h'

export default () =>
  h('div', { className: 'absolute-center-container' },
    h('div', { className: 'map-error-message' },
      'There was an error loading the map. Please try again later.'))
