import React, { useState } from 'react'
import { UdInput } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState('')

  const onChange = (v: any) => {
    console.log(v.target.value)
    setValues(v.target.value)
  }

  return (
    <>
      <UdInput onChange={onChange} value={values} />
    </>
  )
}

export default Demo
