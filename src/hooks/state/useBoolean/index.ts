import _ from 'lodash'
import { useState } from 'react'

function useBoolean(initialValue: boolean): [boolean, (newValue?: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = (newValue?: boolean) => {
    if (_.isBoolean(newValue)) {
      setValue(newValue)
    } else {
      setValue(!value)
    }
  }

  return [value, toggle]
}

export { useBoolean }
