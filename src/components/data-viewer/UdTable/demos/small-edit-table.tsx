import React, { useRef, useState } from 'react'
import { Button, Input, Select } from 'antd'
import { UdTable, UdTableInstance, useMount } from '../../../../index'
import { validators } from '../../../../utils'

const Demo = () => {

  let table = useRef<UdTableInstance>()
  let [dataSource, setDataSource] = useState([])
  let [showValue, setShowValue] = useState('')

  useMount(() => {
    setDataSource([
      { username: 'huyao', gender: 1, age: 18 },
      { username: '王小龙', gender: 1, age: 20 },
      { username: '郭德旺', gender: 1, age: 38 },
      { username: '萧亚', gender: 0, age: 16 },
    ])
  })

  const getRows = () => {
    let rows = table.current.getRows()
    setShowValue(JSON.stringify(rows, null, 4))
  }

  return (
    <div>
      <UdTable
        size={'small'}
        formErrorTipMode='tooltip' // 当size为small时， formErrorTipMode默认为tooltip
        ref={(ref) => table.current = ref}
        editable={true}
        pagination={false}
        dataSource={dataSource}
        columns={[
          {
            title: '姓名', dataIndex: 'username', editable: true, rules: [
              { required: true, message: '请输入正确的姓名' },
            ]
          },
          {
            title: '性别', dataIndex: 'gender', render: (value) => value == 0 ? '女' : '男', editable: true,
            rules: [{required: true, message: '请选择性别'}],
            editor: (
              <Select allowClear={true}>
                <Select.Option value={0}>女</Select.Option>
                <Select.Option value={1}>男</Select.Option>
              </Select>
            )
          },
          { title: '年龄', dataIndex: 'age', style: (text) => { return { color: text > 18 ? 'red' : 'greed' } } }
        ]}
      />
      <p style={{ marginTop: '15px' }}>
        <Button.Group>
          <Button type="primary" onClick={getRows}>获取整个表单的值</Button>
        </Button.Group>
      </p>
      <pre>{showValue}</pre>
    </div>
  )
}

export default Demo
