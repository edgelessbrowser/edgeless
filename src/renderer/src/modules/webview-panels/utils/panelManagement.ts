import { removePanel, addPanel } from '@renderer/store'
import BrowserEvents from '../../../utils/browserEvents'

export async function addNewTab() {
  addPanel({})
}

export function removeTab(id: string) {
  removePanel(id)
  BrowserEvents.send('TAB:REMOVE', id)
}
