import { useOceanDepthContext } from '../context/OceanDepthContext'
import { getZone } from '../constants/depthZones'

export function useOceanDepth() {
  const { depth, depthRef } = useOceanDepthContext()
  const depthMeters = Math.round(depth * 6000)
  const zone        = getZone(depth)
  return { depth, depthRef, depthMeters, zone }
}
