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
    options: [ '2013', '2014', '2015', '2016', '2017' ]
  }
]

export const colors = {
  defaultPoint: 'rgb(54, 97, 193)',
  localPoint: 'rgb(226, 93, 93)',
  selected: 'rgb(93, 241, 170)'
}
