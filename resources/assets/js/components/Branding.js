import h from 'h'

export default () =>
  h('div', { className: 'branding' },
    h('div', { className: 'branding-logos' },
      h('a', { href: 'https://core.uconn.edu', className: 'squared-labs-logo', target: '_blank', rel: 'noopener noreferrer' },
        h('img', { src: '/img/squared-labs.svg' })),
      h('a', { href: 'https://uconn.edu', className: 'uconn-logo', target: '_blank', rel: 'noopener noreferrer' },
        h('img', { src: '/img/uconn-wordmark-single-blue.png' }))),
    h('div', { className: 'attribution' },
      h('a', { href: 'http://openmaptiles.org/', target: '_blank', rel: 'noopener noreferrer' }, '© OpenMapTiles'),
      ' ',
      h('a', { href: 'http://www.openstreetmap.org/about/', target: '_blank', rel: 'noopener noreferrer' }, '© OpenStreetMap contributors')))
