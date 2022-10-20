import React, { useState } from 'react'
import { UdTextArea } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState('')

  const onChange = (v: any) => {
    console.log(v.target.value)
    setValues(v.target.value)
  }

  return (
    <>
      <UdTextArea onChange={onChange} value={values} />
    </>
  )
}

export default Demo
