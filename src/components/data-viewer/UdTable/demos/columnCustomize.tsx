import React from 'react'
import { UdTable, columnRenders } from '../../../../index'

const Demo = () => {
  return (
    <UdTable
      tableKey="demo-table-1"
      useColumnCustomize={true}
      columns={[
        { title: '姓名', dataIndex: 'username', fixedWidth: '60px' },
        { title: '性别', dataIndex: 'gender' },
        { title: '年龄', dataIndex: 'age' },
        { title: '地址', dataIndex: 'address' },
        {
          title: '操作', dataIndex: 'operate', fixed: 'right', allowHide: false, render: columnRenders.operate([
            { title: '测试', action: () => { } }
          ])
        },
      ]}
      dataSource={[
        { username: 'huyao', gender: 1, age: 18, address: '广东省广州市越秀区实惠多货仓式商场东环分店，广东省广州市越秀区实惠多货仓式商场东环分店，广东省广州市越秀区实惠多货仓式商场东环分店' },
        { username: '王小龙', gender: 1, age: 20, address: '一个 Nginx 防火墙模块。我差点就错过了的宝藏项目，它使用简单不需要复杂的配置，支持的功能直戳我的痛点' },
        { username: '郭德旺', gender: 1, age: 38, address: '一款功能丰富的开源游戏引擎。最初它只是一款 2D 引擎，近期拓展了 3D 部分的能力。一款功能丰富的开源游戏引擎。最初它只是一款 2D 引擎，近期拓展了 3D 部分的能力。' },
        { username: '萧亚', gender: 0, age: 16, address: '基于 JavaScript 实现的轻量级 Web 电子表格库。它功能齐全，包含表格的基本操作和函数等，还有详细的中文文档' },
      ]}
    />
  )
}

export default Demo
