import cn from 'classnames'
import h from 'h'

export default ({ label, expanded, onClick }) =>
  h('div', {
    className: cn('expand-button', { expanded }),
    onClick,
    children: [
      label,
      h('span', { className: 'expand-indicator' }, '›')
    ]
  })
