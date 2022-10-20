import React, { useState } from 'react'
import { message, Input } from 'antd'
import { UdForm, UdAjaxSelect } from '../../../../index'

const Demo = () => {
  const [value, setValue] = useState<string>('')
  const [params, setParams] = useState<any>({})

  const changeValue = (v: any) => {
    console.log(v.target.value)
    const value = v.target.value

    if (value) {
      setParams({ name: value })
    } else {
      setParams(undefined)
    }
  }

  const change = (val: any) => {
    setValue(val)
    message.success('选中值为：' + val)
  }

  return (
    <div>
      <p>
        当Input里面的值改变后重新获取下拉数据： <Input onChange={changeValue} />
      </p>

      <UdAjaxSelect
        style={{ width: '200px' }}
        queryAfterMount={false}
        params={params}
        value={value}
        onChange={change}
        query="http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ajax-select/linkage"
      />
    </div>

  )
}

export default Demo
