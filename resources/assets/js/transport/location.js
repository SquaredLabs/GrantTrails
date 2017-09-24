import qs from 'qs'
import fetch from 'isomorphic-fetch'

export default (opts) => {
  opts = Object.keys(opts).reduce((acc, key) => (
    opts[key] !== '' ? { ...acc, [key]: opts[key] } : acc
  ), {})
  return fetch('/api/location' + '?' + qs.stringify(opts))
}

export const getSingle = id =>
  fetch('/api/location/' + id)
