import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { Button, InputNumber, message, Select } from 'antd'
import { UdTable, UdTableInstance, useMount } from '../../../../index'

const Demo = () => {

  let table = useRef<UdTableInstance>()
  let [dataSource, setDataSource] = useState([])
  let [editRowIndex, setEditRowIndex] = useState(-1)
  let rowData = useRef({})

  useMount(() => {
    setDataSource([
      { id: 1, username: 'huyao', gender: '男', age: 18 },
      { id: 2, username: '王小龙', gender: '男', age: 20 },
      { id: 5, username: '郭德旺', gender: '男', age: 38 },
      { id: 10, username: '萧亚', gender: '女', age: 16 }
    ])
  })

  const editable = (text: any, record: any, index: number) => {
    return editRowIndex == index
  }

  const edit = (index: number) => {
    rowData.current = _.cloneDeep(table.current.getRowsByIndex(index)[0])
    setEditRowIndex(index)
  }

  const save = () => {
    table.current.getRowsAndValidate().then(rows => {
      setEditRowIndex(-1)
    }, () => {
      message.error('表单验证不通过')
    })
  }

  const cancel = () => {
    table.current.setRowsByIndex(rowData.current, editRowIndex)
    setEditRowIndex(-1)
  }

  return (
    <UdTable
      ref={(ref) => table.current = ref}
      editable={true}
      pagination={false}
      dataSource={dataSource}
      columns={[
        { title: '编号', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'username', editable: editable, required: true },
        {
          title: '性别', dataIndex: 'gender', editable: editable, editor: (
            <Select>
              <Select.Option value={'女'}>女</Select.Option>
              <Select.Option value={'男'}>男</Select.Option>
            </Select>
          )
        },
        { title: '年龄', dataIndex: 'age', editable: editable, editor: <InputNumber min={1} max={140} /> },
        {
          title: '操作', dataIndex: 'operate', render: (text, row, index) => {
            if (editRowIndex == index) {
              return (
                <>
                  <a onClick={() => save()}>保存</a>
                  <a onClick={() => cancel()} style={{ marginLeft: '10px' }}>取消</a>
                </>
              )
            } else {
              return <>
                <a onClick={() => edit(index)}>编辑</a>
                <a onClick={() => {
                  const xxx = table.current.getRowsByKeys([row.rowKey])
                }}>获取行</a>
                <a onClick={() => {
                  table.current.setRowsByKeys({ age: 99 }, [row.rowKey])
                }}>设置行</a>
              </>
            }
          }
        },
      ]}
    />
  )
}

export default Demo
