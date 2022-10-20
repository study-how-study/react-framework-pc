import _ from 'lodash'
import { useCallback, useState } from 'react'

function useSetState<T extends object>(initialState: T = {} as T)
  : [T, (patch: Partial<T> | ((prevState: T) => Partial<T>), merge?: boolean) => void] {
  const [state, set] = useState<T>(initialState)

  const setState = useCallback((patch: any, merge: boolean = true) => {
    set(prevState => {
      let state = _.isFunction(patch) ? patch(prevState) : patch
      if (merge) {
        return _.merge({}, prevState, state)
      } else {
        return state
      }
    })
  }, [set])

  return [state, setState]
}

export { useSetState }
