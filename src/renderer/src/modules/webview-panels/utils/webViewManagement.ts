import ViewPanelState from '../store/ViewPanelState'
import BrowserEvents from '../../../utils/browserEvents'

export async function addNewTab() {
  const panel = await BrowserEvents.invoke('TAB:CREATE')
  console.log('panel:', panel)
}

export function removeTab(id: string) {
  ViewPanelState.removePanel(id)
  // BrowserEvents.send('TAB:REMOVE', id)
}
