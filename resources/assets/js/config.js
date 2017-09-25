export const TILESERVER_URL = process.env.MIX_TILESERVER_URL || ''
export const POINTS_ENDPOINT = '/api/points'

export const filters = [
  {
    name: 'Payees',
    options: [ 'Employees', 'Vendors', 'Subagreements', 'Other' ]
  },
  {
    name: 'Grant Type',
    options: [ 'Federal', 'State', 'Corporate', 'Other' ]
  },
  {
    name: 'Fiscal Year',
    type: 'multi',
    options: [ '2014', '2015', '2016', '2017' ]
  }
]

export const colors = {
  defaultPoint: 'rgb(54, 97, 193)',
  localPoint: 'rgb(226, 93, 93)',
  selected: 'rgb(93, 241, 170)'
}

// The @markdown comment allows for markdown syntax highlighting when using the
// language-babel Atom package.
export const about = /* @markdown */`
# Husky Trails

While federal, state, and corporate research grants support researchers at an institution, they also play an important role in supporting local economies in a manner that often gets overlooked.

The reason for this is that grant dollars almost never stay completely within an institution, instead they are used to pay for equipment, reagents, consumables, salaries, etc. that are required for actually carrying out the research.

Not surprisingly the companies providing the goods purchased on grants, and the people (graduate students, post-doctoral fellows, technicians, etc.) employed on grant dollars, tend to be located (or live) within relatively close proximity to the institution carrying out the research.

What you’re looking at here is a visualization of where direct grant dollars received by UConn faculty were spent within Connecticut between fiscal years 2014 to 2017.

Feel free to explore the visualization by typing in a location (city or zip), adjusting filters, or just panning and zooming on the map. Most importantly [let us](https://squaredlabs.uconn.edu) know what you think!

## Credit

Husky Trails is an open source project available for universities to showcase their geographic grant distribution. Source code can be found on [GitHub](https://github.com/SquaredLabs/HuskyTrails).

The project built using an extensive library of open data and software. A brief list can be found in the [copyright and license file](https://github.com/SquaredLabs/HuskyTrails/blob/master/LICENSE.md).
`
