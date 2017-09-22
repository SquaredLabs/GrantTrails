import React from 'react'

export default (type, props, ...children) => {
  if (React.isValidElement(props) || typeof props === 'string' || typeof props === 'number') {
    children = [props, ...children]
    props = null
  }

  return React.createElement(type, props, ...children)
}
