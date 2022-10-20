import React, { useState } from 'react'
import { UdForm, UdDatePicker } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState('')

  return (
    <>
      <UdForm
        initialValues={{
          date3: '2020-07-21 11:50:36'
        }}
        items={[
          { name: 'date1', label: '日期', render: <UdDatePicker /> },
          { name: 'date2', label: '自定义格式', render: <UdDatePicker format="YYYY/MM/DD" /> },
          { name: 'date3', label: '日期 + 时间', render: <UdDatePicker showTime /> }
        ]}
        onFinish={(values) => {
          setValues(JSON.stringify(values, null, 4))
        }}
      />
      <pre>{values}</pre>
    </>
  )
}

export default Demo
