import _ from 'lodash'
import moment from 'moment'
import { TableExport, Defaults } from 'tableexport'
import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { Icon } from '@ant-design/compatible'
import { ExportOutlined } from '@ant-design/icons'
import { IUdTableProps } from '../typings'

const exporter = {
  export: (format: string, tableDOM: HTMLDivElement, props: IUdTableProps, columns: ColumnProps<any>[]) => {
    let title = moment().format('YYYY-MM-DD hh.mm.ss.SSS').toString()
    let ignoreCols = []
    if (_.isFunction(_.get(props, 'rowSelection.onChange'))) {
      ignoreCols.push(0)
    }
    let operateColIndex = _.findIndex(columns, n => n.dataIndex == 'operate' || n.title == '操作')
    if (operateColIndex > -1) {
      // 第一列的选择列 不算
      ignoreCols.push(ignoreCols.length == 0 ? operateColIndex : (operateColIndex + 1))
    }

    const options: Defaults = {
      headers: true, // 导出列表头
      footers: false, // 导出列表尾
      formats: [format], // 导出格式
      filename: title, // 导出文件名
      exportButtons: false, // 自动生成导出按钮
      ignoreRows: undefined,
      ignoreCols: ignoreCols,
      trimWhitespace: true,
      RTL: false,
      sheetname: title,
    }

    let tableDOMCopy = tableDOM.cloneNode(true)
    /** antd table表格设置滚动后，会出现第一行为空的行;手动去除,避免导出的表格出现空行 */
    let row0 = (tableDOMCopy as any).getElementsByClassName('ant-table-measure-row')
    if (row0 && row0[0]) {
      row0[0].remove()
    }

    const tableExport = new TableExport(tableDOMCopy, options)
    const datas = tableExport.getExportData() as any

    const file = datas[Object.keys(datas)[0]][format]
    let fileContent = format == 'csv' ? ('\ufeff' + file.data) : file.data
    tableExport.export2file(fileContent, file.mimeType, file.filename, file.fileExtension)
  },
  buildExportBtns(props: IUdTableProps, tableDOM: HTMLDivElement, columns: ColumnProps<any>[]) {
    if (props.useExport === false) {
      return null
    }
    let formats: string[] = ['txt', 'csv', 'xlsx']
    let formatIcons = { 'txt': 'text', 'csv': 'pdf', 'xlsx': 'excel' }
    if (_.isArray(props.useExport)) {
      formats = props.useExport
    }
    const menu = (
      <Menu>
        {
          formats.map(item => (
            <Menu.Item key={item} onClick={() => exporter.export(item, tableDOM, props, columns)}>
              <Icon type={`file-${(formatIcons as any)[item]}`} />
              {`导出为 ${item} 格式`}
            </Menu.Item>
          ))
        }
      </Menu>
    )
    return (
      <Dropdown key="export-dropdown" overlay={menu} placement="bottomRight" arrow>
        <Button><ExportOutlined /></Button>
      </Dropdown>
    )
  }
}

export { exporter }
