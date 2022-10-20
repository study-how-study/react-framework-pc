import _ from 'lodash'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { Button, Checkbox, InputNumber, Modal, Select, Spin, Tooltip } from 'antd'
import { DragOutlined, SettingOutlined } from '@ant-design/icons'
import { IUdColumn } from '../typings'
import { ColCustomRepo, ICustomColumnsItem } from '.'

const Option = Select.Option

const UdTableColumnCustomize: React.FC<IUdTableColumnCustomizeProps> = (props) => {

  const repo = useRef<ColCustomRepo>()
  const [leftItems, setLeftItems] = useState<ICustomColumnsItem[]>([])
  const [middleItems, setMiddleItems] = useState<ICustomColumnsItem[]>([])
  const [rightItems, setRightItems] = useState<ICustomColumnsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    repo.current = new ColCustomRepo()
    return () => repo.current?.close()
  }, [])

  useEffect(() => {
    if (modalVisible) {
      setLoading(true)
      repo.current!.open().then(() => {
        repo.current!.get(props.tableKey).then((res) => {
          if (res && res.length > 0) {
            let [left, middle, right] = [[] as any[], [] as any[], [] as any[]]
            for (let i = 0; i < props.columns.length; i++) {
              const col = { ...props.columns[i] }
              let index = res.findIndex(n => n.key == col.dataIndex)
              let item: ICustomColumnsItem
              if (index >= 0) {
                item = res[index];
                (item as any)['@index'] = index
              } else {
                item = { key: col.dataIndex as string, show: true }
                if (col.fixed && _.isString(col.fixed)) {
                  item.fixed = col.fixed
                }
              }
              if (item.fixed && item.fixed == 'left') {
                left.push(item)
              } else if (item.fixed && item.fixed == 'right') {
                right.push(item)
              } else {
                middle.push(item)
              }
            }
            left = sort(left)
            middle = sort(middle)
            right = sort(right)
            setLeftItems(left)
            setMiddleItems(middle)
            setRightItems(right)
          } else {
            reset()
          }
        }).finally(() => {
          setLoading(false)
        })
      })
    } else {
      repo.current?.close()
    }
  }, [modalVisible])

  const showModal = async () => {
    setModalVisible(true)
  }

  const sort = (items: any[]) => {
    return _.map(_.sortBy(items, '@index'), n => {
      delete n['@index']
      return n
    })
  }

  const save = (items: ICustomColumnsItem[]) => {
    let values = items.map(n => {
      if (n.fixed == null || n.fixed == '') {
        delete n['fixed']
      }
      delete (n as any)['chosen']
      delete (n as any)['selected']
      return n
    })
    let change = checkChange(items)

    let success = () => {
      setModalVisible(false)
      props.onChange && props.onChange(values)
    }

    if (change) {
      repo.current?.set(props.tableKey, values).then(success)
    } else {
      repo.current?.del(props.tableKey).then(success)
    }
  }

  const reset = () => {
    let left = props.columns.filter(n => n.fixed && n.fixed == 'left').map<ICustomColumnsItem>(n => {
      return { key: n.dataIndex as string, show: true, fixed: 'left' }
    })
    let middle = props.columns.filter(n => !n.fixed).map<ICustomColumnsItem>((n) => {
      return { key: n.dataIndex as string, show: true }
    })
    let right = props.columns.filter(n => n.fixed && n.fixed == 'right').map<ICustomColumnsItem>(n => {
      return { key: n.dataIndex as string, show: true, fixed: 'right' }
    })
    setLeftItems(left)
    setMiddleItems(middle)
    setRightItems(right)
  }

  const cancel = () => {
    setModalVisible(false)
  }

  const checkChange = (items: ICustomColumnsItem[]) => {
    for (let i = 0; i < props.columns.length; i++) {
      const col = props.columns[i]
      if (
        items[i] == null
        || !items[i].show
        || items[i].key != col.dataIndex
        || items[i].fixed != col.fixed
        || (items[i].widths != null && Object.keys(items[i].widths!).length > 0)) {
        return true
      }
    }
    return false
  }

  const buildNodes = (items: ICustomColumnsItem[], setItems: any) => {
    let nodes: ReactNode[] = []
    if (items && items.length > 0) {
      items.forEach((item: ICustomColumnsItem, index) => {
        let define = _.find(props.columns, (col => col.dataIndex == item.key))
        if (define) {
          let widthType = (item.widths == null || Object.keys(item.widths).length == 0) ? 'default' : 'fixedWidth'
          nodes.push(
            <div className="item" key={item.key}>
              <DragOutlined />
              <Checkbox
                key={item.key} checked={item.show} disabled={define.allowHide === false}
                onChange={(e) => {
                  items[index].show = e.target.checked
                  setItems(_.clone(items))
                }}
              >
                {define.rawTitle || define.title}
              </Checkbox>
              {
                item.show && (
                  <div className="setting-area">
                    {/* <div className="color-setting">
                      <input type="color" />
                    </div> */}
                    <div className="fixed-setting">
                      <Select size="small" style={{ width: '95px' }} value={item.fixed || ''} onChange={(e) => {
                        let newItems = _.clone(items)
                        _.remove(newItems, n => n.key == item.key)
                        item.fixed = e
                        if (e == 'left') {
                          leftItems.push(item)
                          setLeftItems(_.clone(leftItems))
                        } else if (e == 'right') {
                          rightItems.push(item)
                          setRightItems(_.clone(rightItems))
                        } else {
                          middleItems.push(item)
                          setMiddleItems(_.clone(middleItems))
                        }
                        setItems(newItems)
                      }}>
                        <Option value={''}>不固定</Option>
                        <Option value="left">靠左固定</Option>
                        <Option value="right">靠右固定</Option>
                      </Select>
                    </div>
                    <div className="width-setting">
                      <Select size="small" value={widthType} onChange={(e) => {
                        item.widths = e == 'default' ? null : { fixedWidth: '100px' } as any
                        setItems(_.clone(items))
                      }}>
                        <Option value="default">默认宽度</Option>
                        <Option value="fixedWidth">指定宽度</Option>
                      </Select>
                      {
                        widthType == 'fixedWidth' && (
                          <InputNumber
                            size="small" min={20} max={2000} precision={0} step={1}
                            value={parseInt(item.widths!.fixedWidth!) || 100}
                            onChange={(v) => {
                              item.widths!.fixedWidth = v + 'px'
                              setItems(_.clone(items))
                            }}
                          />
                        )
                      }
                    </div>
                  </div>
                )
              }
            </div>
          )
        }
      })
    }
    return nodes
  }

  const buildSaveBtn = () => {
    let items = [...leftItems, ...middleItems, ...rightItems]
    let showCount = _.filter(items, (value => value.show == true)).length
    let saveBtn = <Button type="primary" onClick={() => save(items)} disabled={showCount == 0}>保存</Button>
    if (showCount == 0) {
      saveBtn = <span style={{ marginLeft: '8px' }}><Tooltip title="最少需要显示一列">{saveBtn}</Tooltip></span>
    }
    return saveBtn
  }

  return (
    <>
      <Tooltip title="配置列" placement={'top'}>
        <Button key='Button' onClick={showModal}><SettingOutlined /></Button>
      </Tooltip>
      <Modal
        className="ud-new-table-column-customize"
        title="自定义表格列"
        width="600px"
        visible={modalVisible}
        onCancel={cancel}
        footer={
          <>
            <Button key='Button' onClick={cancel}>关闭</Button>
            <Button key='Button1' onClick={reset}>恢复</Button>
            {!loading && buildSaveBtn()}
          </>
        }
      >
        <div className="ud-new-table-column-customize-content">
          <Spin spinning={loading} />
          {!loading && (
            <>
              <ReactSortable
                className="left-items"
                list={leftItems as any} handle=".anticon-drag"
                setList={newState => setLeftItems(newState as any)}>
                {buildNodes(leftItems, setLeftItems)}
              </ReactSortable>
              <ReactSortable
                className="middle-items"
                list={middleItems as any} handle=".anticon-drag"
                setList={newState => setMiddleItems(newState as any)}>
                {buildNodes(middleItems, setMiddleItems)}
              </ReactSortable>
              <ReactSortable
                className="right-items"
                list={rightItems as any} handle=".anticon-drag"
                setList={newState => setRightItems(newState as any)}>
                {buildNodes(rightItems, setRightItems)}
              </ReactSortable>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

export interface IUdTableColumnCustomizeProps {
  tableKey: string
  columns: IUdColumn[]
  onChange: (items: ICustomColumnsItem[]) => void
}

export { UdTableColumnCustomize }
