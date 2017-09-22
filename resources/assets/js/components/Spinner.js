import React from 'react'
import h from 'h'

export default class Spinner extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return h('div', { className: 'spinner' },
      h('div', { className: 'spinner-arc' }))
  }
}
