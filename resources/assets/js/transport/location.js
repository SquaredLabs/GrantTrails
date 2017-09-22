import qs from 'qs'
const { fetch } = window

export default (opts) => {
  opts = Object.keys(opts).reduce((acc, key) => (
    opts[key] !== '' ? { ...acc, [key]: opts[key] } : acc
  ), {})
  return fetch('/api/location' + '?' + qs.stringify(opts))
}

export const getSingle = id =>
  fetch('/api/location/' + id)
