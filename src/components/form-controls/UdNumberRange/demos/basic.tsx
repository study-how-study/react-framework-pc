import React, { useState } from 'react'
import { UdForm, UdNumberRange } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState<number[]>([])

  const onChange = (v: any) => {
    console.log(v)
    setValues(v)
  }

  return (
    <>
      <UdNumberRange onChange={onChange} value={values} />
    </>
  )
}

export default Demo
