import React from 'react'
import { Select } from 'antd'
import { UdAjaxSelect } from '../../../../index'

const { Option } = Select

const Demo = () => {

  return <>
    <p>
      <label>数组映射：</label>
      <UdAjaxSelect
        style={{ width: '200px' }}
        query="http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ajax-select/mapping_array"
        mapping={'array'}
      />
    </p>
    <p>
      <label>对象字段映射：</label>
      <UdAjaxSelect
        style={{ width: '200px' }}
        query="http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ajax-select/mapping"
        mapping={{ title: 'name', value: 'id' }}
      />
    </p>
    <p>
      <label>完全自定义映射：</label>
      <UdAjaxSelect
        style={{ width: '200px' }}
        query="http://10.4.100.71:7300/mock/5f1e2923354a5600202741f3/uaf/ajax-select/mapping"
        mapping={(value: any) => {
          return <Option value={value.id} disabled={value.id % 5 == 0}>{value.name}</Option>
        }}
      />
    </p>
  </>
}

export default Demo
