import React, { useState } from 'react'
import { UdForm, UdDateRangePicker } from '../../../../index'

const Demo = () => {

  const [values, setValues] = useState('')

  return (
    <>
      <UdForm
        initialValues={{
          ['dateA1|dateA2']: ['2020-06-22 15:21:41', '2020-07-22 15:21:43'],
          dateC1: '2020-06-21 11:50:36',
          dateC2: '2020-07-21 15:47:40'
        }}
        items={[
          { name: 'dateA1|dateA2', label: '日期', render: <UdDateRangePicker /> },
          { name: 'dateB1|dateB2', label: '自定义格式', render: <UdDateRangePicker format="YYYY/MM/DD" allowClear={false} /> },
          { name: 'dateC1|dateC2', label: '日期 + 时间', render: <UdDateRangePicker showTime /> },
          { name: 'dateD1|dateD2', label: '日期，自动补时间', render: <UdDateRangePicker timeFill={true} /> }
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
