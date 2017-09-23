import React from 'react'
import h from 'h'
import ReactMarkdown from 'react-markdown'
import { about } from 'config'

export default class extends React.Component {
  render () {
    const renderers = { Link: ({ href, children }) => h('a', { href, target: '_blank' }, children) }
    return h('div', { className: 'about-pane' },
      h(ReactMarkdown, { source: about, renderers }))
  }
}
