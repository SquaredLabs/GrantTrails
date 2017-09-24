import React from 'react'
import h from 'h'

/*
 * Components that react on their own without reconciling their parent will
 * not cause this component to change height. Use a PureComponent if
 * performance is a concern here.
 */

export default class extends React.Component {
  componentWillUpdate () {
    this.oldHeight = this.container.scrollHeight
  }

  componentDidUpdate () {
    // Clear the style height so we can find out the element's new height.
    this.container.style.height = null
    const newHeight = this.container.scrollHeight

    if (this.oldHeight === newHeight) return

    this.container.style.height = this.oldHeight + 'px'

    // Ocassionally, updates may become batched, causing componentWillUpdate to
    // be called again before its corresponding component componentDidUpdate
    // was fired. This component needs to be updated to handle this scenario.
    // At the current state, it shows a flicker in this scenario.
    this.oldHeight = newHeight

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this.container.style.height = newHeight + 'px'

        // This component is still a bit buggy on some browsers. Set height to
        // auto after our animation to ensure items don't get incorrectly cut.
        // Under normal circumstances, this should have no effect.
        this.container.addEventListener('transitionend', () => {
          this.container.style.height = null
        })
      })
    })
  }

  render () {
    const { children, duration = '.25s', ...rest } = this.props
    return h('div', {
      style: { 'transitionDuration': duration, overflow: 'hidden' },
      ...rest,
      ref: el => { this.container = el },
      children
    })
  }
}
