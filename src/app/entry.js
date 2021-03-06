import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import { getPrefetchedData, getDeferredData } from 'react-fetcher'
import { after, flow } from 'lodash'
import { makeContent } from 'app/utils/makeContent'
import { history } from 'app/state/history'
import { store } from 'app/state/store'
import makeRoutes from 'app/makeRoutes'
import DevTools from 'app/components/containers/DevTools'
import debug from 'debug'

debug.enable(process.env.DEBUG)

const log = {
  env: debug('environment'),
}

log.env(`Running in [${process.env.NODE_ENV}] environment`)

const onUpdate = flow(
  after(2, function handleRouterUpdate() {
    const { components, location, params } = this.state
    getPrefetchedData(components, { store, location, params })
  }),
  function clientOnlyRouteUpdate() {
    const { components, location, params } = this.state
    getDeferredData(components, { store, location, params })
  }
)

ReactDOM.render(
  makeContent(
    <Router history={history} onUpdate={onUpdate}>
      {makeRoutes()}
    </Router>, store),
  document.getElementById('application-root')
)

if (process.env.NODE_ENV === 'development') {
  ReactDOM.render(
    makeContent(<DevTools />, store),
    document.getElementById('debug-panel-root')
  )
}

if (module.hot) {
  module.hot.accept('./reducers', () =>
    store.replaceReducer(require('./reducers'))
  )
}
