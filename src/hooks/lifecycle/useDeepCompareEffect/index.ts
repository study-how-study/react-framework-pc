import React, { DependencyList, EffectCallback, useRef, useEffect } from 'react'
import { isEqual } from 'lodash'

const useDeepCompareEffect = <T extends DependencyList>(effect: EffectCallback, deps: T) => {

  const ref = useRef<T | undefined>(undefined)

  if (!ref.current || !isEqual(deps, ref.current)) {
    ref.current = deps
  }

  useEffect(effect, ref.current)

}

export { useDeepCompareEffect }
