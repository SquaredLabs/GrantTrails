import React from 'react'
import h from 'h'
import ReactMarkdown from 'react-markdown'

export default class extends React.Component {
  render () {
    const renderers = { Link: ({ href, children }) => h('a', { href, target: '_blank' }, children) }
    return h('div', { className: 'about-pane' },
      h(ReactMarkdown, { source, renderers }))
  }
}

// The @markdown comment allows for markdown syntax highlighting when using the
// language-babel Atom package.
const source = /* @markdown */`
# Husky Trails

While federal, state, and corporate research grants support researchers at an institution, they also play an important role in supporting local economies in a manner that often gets overlooked.

The reason for this is that grant dollars almost never stay completely within an institution, instead they are used to pay for equipment, reagents, consumables, salaries, etc. that are required for actually carrying out the research.

Not surprisingly the companies providing the goods purchased on grants, and the people (graduate students, post-doctoral fellows, technicians, etc.) employed on grant dollars, tend to be located (or live) within relatively close proximity to the institution carrying out the research.

What you’re looking at here is a visualization of where grant dollars received by UConn faculty were spent within the United States between fiscal years 2013 to 2017.  Dollars spent within our state are highlighted in red.

Feel free to explore the visualization by typing in a location (city/state or zip), adjusting filters, or just panning and zooming on the map.  Most importantly let us know what you think!

## Credit

Husky Trails is an open source project available for universities to showcase their geographic grant distribution. Source code can be found on [GitHub](https://github.com/SquaredLabs/HuskyTrails).

The project built using an extensive library of open data and software. A brief list can be found in the [copyright and license file](https://github.com/SquaredLabs/HuskyTrails/blob/master/LICENSE.md).
`
