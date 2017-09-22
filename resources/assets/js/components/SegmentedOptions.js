import cn from 'classnames'
import h from 'h'

export default ({ selected, onChange, options, mode }) =>
  h('div', { className: 'segmented-control' },
    h(RadioSwitchOption, {
      className: 'segmented-control-reset',
      label: options.length === 2 ? 'Both' : 'All',
      selected: selected.length === 0,
      onClick: () => onChange([])
    }),
    options.map(option => h(RadioSwitchOption, {
      key: option,
      className: 'segmented-control-option',
      label: option,
      selected: selected.includes(option),
      onClick: () => onChange(selected.includes(option)
        ? selected.filter(x => x !== option)
        : mode === 'multi' ? [...selected, option] : [option]
      )
    })))

const RadioSwitchOption = ({ label, selected, onClick, className }) =>
  h('span', {
    className: cn(className, { selected }),
    onClick,
    children: label
  })
