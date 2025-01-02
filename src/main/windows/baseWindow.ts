import { BaseWindow } from 'electron'

export const baseWindow = (): BaseWindow => {
  return new BaseWindow({
    width: 1200,
    height: 800,
    // transparent: true,
    frame: false,
    show: true,
    titleBarStyle: 'hiddenInset',
    titleBarOverlay: false,
    backgroundColor: '#475569',
    // center: false,
    roundedCorners: true,
    useContentSize: true,
    trafficLightPosition: {
      x: 15,
      y: 12
    }
  })
}
