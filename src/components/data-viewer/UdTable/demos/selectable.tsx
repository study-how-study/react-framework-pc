import React, { useRef, useState } from 'react'
import { Button, TablePaginationConfig } from 'antd'
import { http } from '../../../../core'
import { UdTable, UdTableInstance, useMount } from '../../../../index'

const Demo = () => {

  let [users, setUsers] = useState([])
  let [rowKeys, setRowKeys] = useState([])
  let [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 10,
    current: 1,
    total: 0
  })

  useMount(() => {
    query()
  })

  function query(newPagination?: TablePaginationConfig) {
    http.post('http://10.4.100.71:7300/mock/618a264ca659b100215c5a3d/user-list', newPagination || pagination).then(res => {
      let { items, ...other } = res.data
      setUsers(items)
      setPagination(other)
    })
  }

  function onTableChange(pagination: TablePaginationConfig) {
    setPagination(pagination)
    query(pagination)
  }

  return (
    <div>
      <UdTable
      editable={true}
        rowKey="id"
        columns={[
          { title: '编号', dataIndex: 'id' },
          { title: '姓名', dataIndex: 'name' }
        ]}
        pagination={pagination}
        dataSource={users}
        onChange={onTableChange}
        // rowSelection={{
        //   selectedRowKeys: rowKeys,
        //   onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
        //     console.log(selectedRowKeys)
        //     setRowKeys(selectedRowKeys)
        //   },
        //   // type: 'radio'
        // }}
      />
      <pre>
        {/* {selectData} */}
      </pre>
    </div>
  )
}

export default Demo
