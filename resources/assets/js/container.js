import h from 'h'
import DevTools from 'mobx-react-devtools'

import Map from 'components/Map'
import Sidebar from 'components/Sidebar'
import Branding from 'components/Branding'

// The NODE_ENV variable is added by Laravel Mix when "npm run prod" is ran.
// Unfortunately, it is not added for "npm run dev".
const inDevelopment = process.env.NODE_ENV !== 'production'

export default () => (
  h('div',
    inDevelopment && h(DevTools),
    h(Map),
    h(Sidebar),
    h(Branding)))
