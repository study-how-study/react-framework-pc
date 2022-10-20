import React, { useState, useEffect } from 'react'
import { message, Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import { UdFilter, IColSpan } from '../../../../index'


const Demo = () => {

  const [colValue, setColValue] = useState(0)
  const [colSpan, setColSpan] = useState<IColSpan>()

  const search = (values: any) => {
    message.info(JSON.stringify(values))
  }

  const options = [
    { label: '默认响应式', value: 0 },
    { label: '固定一行4个', value: 6 },
    { label: '固定一行3个', value: 8 },
    { label: '固定一行2个', value: 12 }
  ]

  const change = (e: RadioChangeEvent) => {
    setColValue(e.target.value)
  }

  useEffect(() => {
    if (colValue === 0) {
      setColSpan(UdFilter.defaultProps?.colSpan)
    } else {
      setColSpan({ span: colValue })
    }
  }, [colValue])

  return (
    <div>
      <p>
        <Radio.Group options={options} onChange={change} value={colValue} optionType="button" />
      </p>
      <UdFilter
        colSpan={colSpan}
        items={[
          { label: '姓名1', name: 'username1' },
          { label: '姓名2', name: 'username2' },
          { label: '姓名3', name: 'username3' },
          { label: '姓名4', name: 'username4' },
          { label: '单独设置', name: 'username5', col: { span: 12 } },
          { label: '姓名6', name: 'username6' },
        ]}
        onSearch={search}
      />
    </div>
  )
}

export default Demo
