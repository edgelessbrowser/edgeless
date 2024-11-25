import { type Component, Switch, Match } from 'solid-js'
import { decodeHashParams } from './modules/pages/utils/parseHashParams'
import RootView from './modules/root/components/RootView'
import DefaultPage from './modules/pages/components/DefaultPage'

const App: Component = () => {
  const page = decodeHashParams('page')

  return (
    <Switch>
      <Match when={page === 'browser'}>
        <RootView />
      </Match>
      <Match when={page === 'default-page'}>
        <DefaultPage />
      </Match>
    </Switch>
  )
}

export default App
