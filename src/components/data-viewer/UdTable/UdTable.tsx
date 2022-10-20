import _ from 'lodash'
import React, { useState, forwardRef, useRef, useCallback, useImperativeHandle, useEffect, ReactElement, Key } from 'react'
import classNames from 'classnames'
import { Table, Modal, Form, Input } from 'antd'
import { SpinProps } from 'antd/lib/spin'
import { NamePath, Store } from 'antd/lib/form/interface'
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table'
import { SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { useDeepCompareEffect } from '../../../hooks'
import { IUdTableProps, IUdColumn, UdTableInstance } from '../../../'
import { watermark } from './utils/watermark'
import { columnsClasses } from './utils/columnClasses'
import { toolbar } from './utils/toolbar'
import { ColCustomRepo, ICustomColumnsItem } from './columnCustomize'
import CustomFieldError from './CustomFieldError'

const UdTable = forwardRef<UdTableInstance, IUdTableProps>((props, ref) => {
  /** 内部自增的rowKey，保证一个表格内rowKey不重复 */
  const rowKeyCount = useRef(0)
  const selectedRowKeysRef = useRef<any[]>([])
  const selectedRowsRef = useRef<any[]>([])
  const paginationRef = useRef<TablePaginationConfig>({})
  const tableWrapperRef = React.useRef<HTMLDivElement>()
  const [form] = Form.useForm()
  const dataSourceRef = useRef<any[]>([])
  const [tableDataSource, setTableDataSource] = useState<any[]>([])
  const columnsOldWidths = React.useRef<any>({})
  const [customColumnsConfig, setCustomColumnsConfig] = useState<ICustomColumnsItem[]>()

  const [count, setCount] = useState(0)

  const delayUpdate = useCallback(_.throttle(() => {
    setCount(count + 1)
  }, 600, { leading: false }), [count])

  const customizable = props.useColumnCustomize && props.tableKey
  let rowKeyName = (_.isEmpty(props.rowKey) ? 'udRowKey' : props.rowKey) as string
  let childrenPropName = 'children'
  if (props.expandable && props.expandable.childrenColumnName) {
    childrenPropName = props.expandable.childrenColumnName
  }

  useImperativeHandle(ref, () => {
    let deleteConfirm = (okCall: Function) => {
      return new Promise<void>((resolve, reject) => {
        Modal.confirm({
          title: '系统提示',
          content: '删除后不可恢复，确认删除吗？',
          okText: "确认",
          cancelText: '取消',
          onOk: () => {
            okCall()
            resolve()
          },
          onCancel: () => {
            reject()
          }
        })
      })
    }
    let refObj: UdTableInstance = {
      tableWrapper: tableWrapperRef.current!,
      form: form, // TODO: 需要包装 form，不然手动修改form的值不方便，且无法触发 formValuesChange 事件，也发修改 dataSourceRef

      setDataSource: (data: any[]) => {
        setDataSource([], data)
      },

      getRows: (filter?: (value: any, index: number, array: any[]) => any) => {
        let rows = dataSourceRef.current
        if (_.isFunction(filter)) {
          rows = rows.filter(filter)
        }
        return rows
      },
      getRowsAndValidate: (filter?: (value: any, index: number, array: any[]) => any) => {
        return new Promise((resolve, reject) => {
          let rows = dataSourceRef.current
          let nameList: NamePath[] | undefined
          if (_.isFunction(filter)) {
            rows = rows.filter(filter)
            if (_.isEmpty(rows)) {
              resolve([])
              return
            }
            nameList = []
            for (const row of rows) {
              for (const key in row) {
                nameList.push(`${key}@${row.udRowKey}`)
              }
            }
          }
          form.validateFields(nameList).then((res) => {
            resolve(rows)
          }, (err) => {
            reject(err.errorFields)
          })
        })
      },
      getSelectedRows: () => {
        return dataSourceRef.current.filter(item => {
          return selectedRowKeysRef.current.includes(item[rowKeyName])
        })
      },
      getSelectedRowsAndValidate: () => {
        return refObj.getRowsAndValidate(n => selectedRowKeysRef.current.includes(n[rowKeyName]))
      },
      getRowsByKeys: (keys: any | any[]) => {
        const keyArray = _.isArray(keys) ? keys : [keys]
        return dataSourceRef.current.filter(item => keyArray.includes(item[rowKeyName]))
      },
      getRowsByKeysAndValidate: (keys: any | any[]) => {
        const keyArray = _.isArray(keys) ? keys : [keys]
        return refObj.getRowsAndValidate((item) => keyArray.includes(item[rowKeyName]))
      },
      getRowsByIndex: (indexs: number | number[]) => {
        const indexArray = _.isArray(indexs) ? indexs : [indexs]
        return dataSourceRef.current.filter((n, index) => indexArray.includes(index))
      },
      getRowsByIndexAndValidate: (indexs: number | number[]) => {
        const indexArray = _.isArray(indexs) ? indexs : [indexs]
        return refObj.getRowsAndValidate((n, index) => indexArray.includes(index))
      },

      pushRows: (rows: Store | Store[]) => {
        setDataSource(_.clone(tableDataSource), _.isArray(rows) ? rows : [rows])
      },
      insertRows: (rows: Store | Store[], index: number) => {
        setDataSource(_.clone(tableDataSource), _.isArray(rows) ? rows : [rows], index)
      },

      deleteSelectedRows: () => {
        refObj.deleteRowsByKeys(selectedRowKeysRef.current)
      },
      deleteSelectedRowsAndConfirm: () => {
        return deleteConfirm(() => refObj.deleteSelectedRows())
      },
      deleteRowsByKeys: (keys: any | any[]) => {
        const keyArray = _.isArray(keys) ? keys : [keys]
        const data = _.clone(dataSourceRef.current)
        _.remove(data, (value) => keyArray.includes(value[rowKeyName]))
        dataSourceRef.current = data
        setTableDataSource(data)
      },
      deleteRowsByKeysAndConfirm: (keys: any | any[]) => {
        return deleteConfirm(() => refObj.deleteRowsByKeys(keys))
      },
      deleteRowsByIndex: (indexs: number | number[]) => {
        const indexArray = _.isArray(indexs) ? indexs : [indexs]
        const data = _.clone(dataSourceRef.current)
        _.remove(data, (value, index) => indexArray.includes(index))
        dataSourceRef.current = data
        // 未删除表单的相关值，推测应该没啥影响
        setTableDataSource(data)
      },
      deleteRowsByIndexAndConfirm: (indexs: number | number[]) => {
        return deleteConfirm(() => refObj.deleteRowsByIndex(indexs))
      },

      setRows: (value: Store, filter?: (value: any, index: number, array: any[]) => any) => {
        let rows = _.clone(dataSourceRef.current)
        for (let i = 0; i < rows.length; i++) {
          if (_.isFunction(filter)) {
            if (filter(rows[i], i, rows)) {
              rows[i] = { ...rows[i], ...value }
            }
          } else {
            rows[i] = { ...rows[i], ...value }
          }
        }
        setDataSource(rows)
      },
      setRowsByKeys: (value: Store, keys: any[]) => {
        refObj.setRows(value, (item) => keys.includes(item[rowKeyName]))
      },
      setSelectedRows: (value: Store) => {
        refObj.setRowsByKeys(value, selectedRowKeysRef.current)
      },
      setRowsByIndex: (value: Store, indexs: number | number[]) => {
        const indexArray = _.isArray(indexs) ? indexs : [indexs]
        refObj.setRows(value, (item, index) => indexArray.includes(index))
      }
    }
    return refObj
  })

  useEffect(() => {
    columnsClasses.createStyleContainer()
    getCustomColumnsConfig()
  }, [])

  useDeepCompareEffect(() => {
    setDataSource([], props.dataSource)
  }, [props.dataSource])

  function getCustomColumnsConfig() {
    if (customizable) {
      let repo = new ColCustomRepo()
      repo.open().then(() => {
        repo.get(props.tableKey!).then((values: ICustomColumnsItem[]) => {
          if (_.isArray(values) && values.length > 0) {
            setCustomColumnsConfig(values)
          }
        })
      })
    }
  }

  function setDataSource(initData: any[], rows?: readonly any[], index?: number) {
    let data: any[] = _.isArray(initData) ? initData : []
    if (rows) {
      const insert = _.isNumber(index)
      const recursive = (item: any) => {
        if (_.isArray(item[childrenPropName]) && item[childrenPropName].length > 0) {
          for (const row of item[childrenPropName]) {
            row.udRowKey = rowKeyCount.current++
            row.udLevel = item.udLevel + 1
            row.udParentRowKey = item.udRowKey
            recursive(row)
          }
        }
      }
      // TODO: 这里判断是否有子级不算严谨，antd 也没提供比较有效的方法。
      for (const item of rows) {
        item.udRowKey = rowKeyCount.current++
        if (item.hasOwnProperty(childrenPropName)) {
          item.udLevel = 0
          recursive(item)
        }
        if (insert) {
          data.splice(index!, 0, item)
          index!++
        } else {
          data.push(item)
        }
      }
    }
    let formData: Store = {}
    for (const item of data) {
      let keys = Object.keys(item)
      for (const key of keys) {
        const name: string = `${key}@${item.udRowKey}`
        formData[name] = item[key]
      }
    }
    dataSourceRef.current = data
    form.setFieldsValue(formData)
    setTableDataSource(data)
  }

  function getTableWrapperRef(instance: HTMLDivElement | null) {
    if (instance && tableWrapperRef.current != instance) {
      tableWrapperRef.current = instance
      watermark.addToTable(instance, props.watermark)
    }
  }

  function processColumns(columns?: IUdColumn[]) {
    let showCols: ColumnProps<any>[] = []
    let allCols: ColumnProps<any>[] = []
    let configs = (_.isArray(customColumnsConfig) && customColumnsConfig.length > 0) ? customColumnsConfig : []
    let hasConfigs = configs.length > 0
    columns = _.isArray(columns) ? columns : []
    columnsOldWidths.current = {}

    const process = (item: IUdColumn) => {
      processColumnEllipsis(item)
      processColumnType(item)
      processColumnSorter(item)
      processColumnRules(item)
      processColumnRender(item)
      processColumnTitle(item)
      processColumnWidth(item)
      // order、功能支持
    }

    for (const item of columns) {
      const col = { ...item }
      process(col)
      allCols.push({ ...col }) //这里后期需要优化下
      if (hasConfigs) {
        let index = configs.findIndex(n => n.key == col.dataIndex)
        if (index >= 0) { // TODO：还需要处理 字段被设置为 allowHide 的特殊情况
          if (configs[index].show) {
            (col as any)['@index'] = index
            col.fixed = configs[index].fixed as any
            if (configs[index].widths) {
              for (const prop in configs[index].widths) {
                (col as any)[prop] = (configs as any)[index].widths[prop]
              }
              processColumnWidth(col)
            }
          } else {
            continue
          }
        }
      }
      showCols.push(col)
    }

    showCols = _.map(_.sortBy(showCols, '@index'), (n: any) => {
      delete n['@index']
      return n
    })
    columnsClasses.writeStyles()
    return { showCols, allCols }
  }

  function processColumnRender(column: IUdColumn) {
    const rawRender = column.render || ((text, row, index) => text)
    let render: Function
    let wrapRender = (text: string, row: any, index: number) => {

      if (paginationRef.current && paginationRef.current.current > 1 && dataSourceRef.current.length > paginationRef.current.pageSize) {
        index = ((paginationRef.current.current - 1) * paginationRef.current.pageSize) + index
      }

      if (row.udLevel == null || row.udLevel === 0) {
        row = dataSourceRef.current[index]
      } else {
        let result = findRowByRowKey(row.udRowKey)
        if (result) {
          row = result
        }
      }
      text = row[column.dataIndex as string]
      if (column.style) {
        return <div style={_.isFunction(column.style) ? column.style(text, row, index) : column.style}>{render(text, row, index)}</div>
      } else {
        return render(text, row, index)
      }
    }
    if (props.editable === true) {
      render = (text: any, row: any, index: number) => {
        let editable = column.editable === true
        if (!editable && typeof (column.editable) === 'function') {
          editable = column.editable(text, row, index)
        }
        if (editable) {
          let Editor: ReactElement = <Input />
          if (column.editor) {
            if (typeof (column.editor) === 'function') {
              Editor = column.editor(text, row, index)
            } else {
              Editor = column.editor
            }
          }
          if (column.onValueChange) {
            Editor = React.cloneElement(Editor, {
              onChange: (value: any) => {
                row = dataSourceRef.current[index]
                text = row[column.dataIndex as string]
                column.onValueChange!(text, row, index)
              }
            })
          }
          const name = `${column.dataIndex}@${row.udRowKey}`
          const formItemProps = column.formItemProps || {}

          const currentFieldError = form.getFieldError(name)
          const renderNode = <Form.Item
            {...formItemProps}
            name={name}
            rules={column.rules}
            className={classNames('column-editor', `column-editor-${column.dataIndex}`, `column-editor-${name}`, formItemProps.className)}
          >
            {Editor}
          </Form.Item>

          const useToopTipErrorTip = props.formErrorTipMode === 'tooltip' || props.size === 'small'
          if (useToopTipErrorTip) {
            return {
              children: <CustomFieldError errors={currentFieldError}>{renderNode}</CustomFieldError>,
              props: {
                className: currentFieldError?.length ? 'hidde-default-error custom-error-active' : 'hidde-default-error'
              }
            }
          } else {
            return renderNode
          }

        } else {
          return rawRender(text, row, index)
        }
      }
    } else {
      render = rawRender
    }
    column.render = (text, row, index) => {
      return wrapRender(text, row, index)
    }
  }

  function processColumnEllipsis(column: IUdColumn) {
    if (column.ellipsis !== false) {
      column.ellipsis = true
    }
    if (_.isEmpty(column.maxWidth)) {
      column.maxWidth = `${props.columnDefaultMaxWidth}px`
    }
  }

  function processColumnType(column: IUdColumn) {
    // 后期可以支持 自动推测功能
    // 需要搞清楚是怎么和导出类型关联的
    column.dataType = column.dataType || 'string'
    column.className = classNames(column.className, 'col-type-' + column.dataType)
  }

  // function processColumnSorter(column: IUdColumn) {
  //   if (props.useDefaultSorter && _.isEmpty(column.sorter)) {
  //     let key = column.dataIndex as string
  //     let sorter = _.isFunction(sorters[column.dataType]) ? sorters[column.dataType] : sorters.string
  //     column.sorter = (a, b) => sorter(a[key], b[key])
  //   }
  // }

  function processColumnTitle(column: IUdColumn) {
    if (!column.rawTitle && column.title && !_.isFunction(column.title)) {
      column.rawTitle = column.title
    }
    if (column.rules && column.rules.length > 0) {
      // 仅支持 rule 为 RuleObject 类型的情况。暂不支持 RuleRender 类型
      if (column.rules.find(n => (n as any).required)) {
        column.title = <>{column.title}<sup>*</sup></>
        if (!classNames(column.className).includes('col-required')) {
          column.className = classNames(column.className, 'col-required')
        }
      }
    }
  }

  function processColumnRules(column: IUdColumn) {
    column.rules = column.rules || []
    let hasRequired = column.rules.find(n => n.required)
    if (hasRequired) {
      column.allowHide = false
    } else {
      if (column.required) {
        column.rules.push({ required: true, message: '必填' })
        column.allowHide = false
      }
    }
  }

  function processColumnWidth(column: IUdColumn) {
    if (column.className) {
      let classs = column.className.split(' ')
      column.className = classs.filter(n => !n.match(/col-.*?-width-.*?/)).join(' ')
    }
    columnsClasses.setColumnWidthClasses(column)
  }

  function processColumnSorter(column: IUdColumn) {
    if (column.sorter == true && column.sortOrder == null) {
      if (props.sortValues && props.sortValues.length > 0) {
        let sortItem = props.sortValues.find(n => n.key == column.dataIndex)
        if (sortItem) {
          column.sortOrder = sortItem.value
        } else {
          column.sortOrder = null
        }
      } else {
        column.sortOrder = null
      }
    }
  }

  function formValuesChange(changedValues: Store, values: Store) {
    for (const changedKey in changedValues) {
      let [dataIndex, rowKey] = [...changedKey.split('@')]
      let row = findRowByRowKey(rowKey)
      if (row) {
        row[dataIndex] = changedValues[changedKey]
      }
    }
    props.formProps?.onValuesChange?.(changedValues, values)
    delayUpdate()
  }

  function findRowByRowKey(rowKey: any) {
    let recursion = (rows: any[]): any => {
      for (const row of rows) {
        if (row.udRowKey == rowKey) {
          return row
        }
        if (_.isArray(row[childrenPropName]) && row[childrenPropName].length > 0) {
          let result = recursion(row[childrenPropName])
          if (result) {
            return result
          }
        }
      }
    }
    return recursion(dataSourceRef.current)
  }

  function processBaseProps(columns: ColumnProps<any>[]) {
    let result: Partial<IUdTableProps> = { rowKey: props.rowKey, useRowSelectionDefaultHandler: props.useRowSelectionDefaultHandler, keepSelectedRows: props.keepSelectedRows }

    // 如果可以编辑，不支持跨页选中
    if (props.editable) {
      result.keepSelectedRows = false
      result.useRowSelectionDefaultHandler = true
    }

    // 如果支持跨页选中， 不使用内部转换处理
    if (result.keepSelectedRows) {
      result.useRowSelectionDefaultHandler = false
    }
    // 如果使用内部转换，自定义rowKey
    if (result.useRowSelectionDefaultHandler) {
      rowKeyName = 'udRowKey'
      result.rowKey = 'udRowKey'
    }

    result.loading = props.loading
    if (_.isBoolean(props.loading)) {
      result.loading = { spinning: props.loading, tip: '数据加载中，请稍等…' } as SpinProps
    }
    if (columns.find(n => !n.fixed) && (props.scroll == null || props.scroll.x == null)) {
      result.scroll = props.scroll || {}
      result.scroll.x = '100%'
    }
    if (props.rowSelection) {
      if (result.useRowSelectionDefaultHandler) {
        const find = (rows: any[], filter: (item: any, index: number, array: any[]) => boolean) => {
          let result: any[] = []
          rows.map((item, index, array) => {
            if (filter(item, index, array)) {
              result.push(item)
            }
            if (_.isArray(item[childrenPropName]) && item[childrenPropName].length > 0) {
              result = result.concat(find(item[childrenPropName], filter))
            }
          })
          return result
        }

        let selectedRowKeys = props.rowSelection.selectedRowKeys ?props.rowSelection.selectedRowKeys : selectedRowKeysRef.current
        if (!_.isEmpty(result.rowKey) && result.rowKey !== props.rowKey) {
          let selectedRows = find(dataSourceRef.current, n => selectedRowKeys.includes(n[props.rowKey!]))
          selectedRowKeys = _.map(selectedRows, result.rowKey)
        }

        result.rowSelection = {
          ...props.rowSelection,
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            // debugger
            selectedRows = find(dataSourceRef.current, n => selectedRowKeys.includes(n.udRowKey))
            // 如果有指定rowkey， 传出指定的字段作为key
            if (!_.isEmpty(props.rowKey)) {
              selectedRowKeys = _.map(selectedRows, props.rowKey)
            }
            selectedRowKeysRef.current = selectedRowKeys
            selectedRowsRef.current = selectedRows
            props.rowSelection?.onChange?.(selectedRowKeysRef.current, selectedRowsRef.current)
          }
        }
      } else {
        result.rowSelection = {
          ...props.rowSelection,
          selectedRowKeys: props.rowSelection.selectedRowKeys ? props.rowSelection.selectedRowKeys : selectedRowKeysRef.current,
          preserveSelectedRowKeys: result.keepSelectedRows,
          onChange: (keys, rows) => {
            selectedRowKeysRef.current = keys
            selectedRowsRef.current = rows
            props.rowSelection?.onChange?.(selectedRowKeysRef.current, selectedRowsRef.current)
          }
        }
      }
    }


    result.onChange = (pagination: TablePaginationConfig, filters: Record<string, Key[] | null>, sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
      /** 如果改变了pagesize,那么回到第一页 */
      let size = paginationRef.current.pageSize
      if (size && (pagination.pageSize != size)) {
        pagination.current = 1
      }
      paginationRef.current = pagination
      if (sorter) {
        if (_.isArray(sorter)) {

        } else {
          if (sorter.column) {
            if (_.isFunction(sorter.column.sorter)) {
              let rows = _.clone(dataSourceRef.current)
              rows.sort(sorter.column.sorter)
              if (sorter.order && sorter.order === 'descend') {
                rows.reverse()
              }
              setDataSource(rows)
            } else {
              //  后端排序？
            }
          } else {
            let rows = _.clone(dataSourceRef.current)
            setDataSource(_.sortBy(rows, ['udRowKey']))
          }
        }
      }
      props.onChange && props.onChange(pagination, filters, sorter, extra)
    }

    return result
  }

  let { showCols, allCols } = processColumns(props.columns)

  const toolbarNode = toolbar.build(props, tableWrapperRef.current, allCols, setCustomColumnsConfig)

  const baseProps = processBaseProps(showCols)


  return (
    <div className={classNames('ud-table-wrapper', props.className)} ref={getTableWrapperRef}>
      {toolbarNode}
      {props.buttonBelow}
      {
        props.editable ?
          <Form

            {...props.formProps}
            form={form}
            onValuesChange={formValuesChange}
            className={classNames('ud-table-form', props.formProps ? props.formProps.className : '')}
          >
            <Table
              {...props}
              {...baseProps}
              columns={showCols}
              dataSource={tableDataSource}
            />
          </Form>
          :
          <Table
            {...props}
            {...baseProps}
            columns={showCols}
            dataSource={tableDataSource}
          />
      }
    </div>
  )

})

UdTable.defaultProps = {
  rowKey: 'id',
  bordered: true,
  useExport: false,
  formErrorTipMode: 'default',
  scroll: {},
  useColumnCustomize: true,
  useToolbarAffix: true,
  columnDefaultMaxWidth: 1000,
  useRowSelectionDefaultHandler: true,
  keepSelectedRows: false,
  // useDefaultSorter: false
}

export { UdTable }
