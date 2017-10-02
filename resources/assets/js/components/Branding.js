import h from 'h'

export default () =>
  h('div', { className: 'branding' },
    h('a', { href: 'https://squaredlabs.uconn.edu', className: 'squared-labs-stamp', target: '_blank', rel: 'noopener noreferrer' },
      h('img', { src: '/img/squared-labs-stamp.svg' })),
    h('a', { href: 'https://uconn.edu', className: 'uconn-logo', target: '_blank', rel: 'noopener noreferrer' },
      h('img', { src: '/img/uconn-wordmark-single-blue.png' })))
