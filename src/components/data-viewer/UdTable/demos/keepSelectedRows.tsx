import React, { useRef, useState } from 'react'
import { Button, TablePaginationConfig } from 'antd'
import { http } from '../../../../core'
import { UdTable, UdTableInstance, useMount } from '../../../../index'

const Demo = () => {

  let table = useRef<UdTableInstance>()
  let [selectData, setSelectData] = useState<any[]>([])
  let [users, setUsers] = useState([])
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

  const getTableData = ()=> {
    table.current.getRowsAndValidate().then(res=> {
      console.log(res)
    })
    const data = table.current.getRowsByKeys(selectData)
    console.log(data)
  }

  return (
    <div>
      <UdTable
        // rowKey="id"
        ref={table}
        keepSelectedRows={true}
        // editable={true}
        // useRowSelectionDefaultHandler={false}
        columns={[
          { title: '编号', dataIndex: 'id' },
          { title: '姓名', dataIndex: 'name', editable: true }
        ]}
        pagination={pagination}
        dataSource={users}
        onChange={onTableChange}
        rowSelection={{
          selectedRowKeys: selectData,
          onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            console.log(selectedRowKeys, selectedRows)
            setSelectData(selectedRowKeys)
          }
        }}
      />
      <pre>
        {selectData}

        <Button onClick={()=> {
          getTableData()
        }}>获取表格数据</Button>
      </pre>
    </div>
  )
}

export default Demo
