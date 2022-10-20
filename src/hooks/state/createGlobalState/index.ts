import { useLayoutEffect, useState, useEffect } from 'react'

export function createGlobalState<S = any>(initialState?: S) {
  const store: IStore<S> = {
    state: initialState,
    setState(state: S) {
      store.state = state
      store.setters.forEach(setter => setter(store.state))
    },
    setters: []
  }

  return (): [S | undefined, (state: S) => void] => {
    const [globalState, stateSetter] = useState<S | undefined>(store.state)

    useEffect(() => () => {
      store.setters = store.setters.filter(setter => setter !== stateSetter)
    }, [])

    useLayoutEffect(() => {
      if (!store.setters.includes(stateSetter)) {
        store.setters.push(stateSetter)
      }
    })

    return [globalState, store.setState]
  }
}

interface IStore<S> {
  state: S | undefined
  setState: (state: S) => void
  setters: any[]
}

export default createGlobalState
