import _ from 'lodash'
import React, { ReactElement, ReactNode } from 'react'
import { Affix, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { UdToolbar } from '../../..'
import { IUdTableProps } from '../typings'
import { ICustomColumnsItem, UdTableColumnCustomize } from '../columnCustomize'
import { exporter } from './exporter'

function buildToolbarBtns(btns?: (ReactElement | (() => ReactElement))[] | ReactNode, more?: ReactElement[]) {
  if (btns || more) {
    let nodes: ReactElement[] = []
    if (btns) {
      if (_.isArray(btns)) {
        _.forEach(btns, (btn) => {
          let Btn: any = _.isFunction(btn) ? btn() : btn
          if (Btn) {
            nodes.push(React.cloneElement(Btn, { key: _.uniqueId('toolbar_btn_') }))
          }
        })
      } else {
        nodes.push(_.isFunction(btns) ? btns() : btns)
      }
    }
    if (more) {
      nodes = nodes.concat(more)
    }
    if (nodes.length > 0) {
      if (btns == null || _.isArray(btns)) {
        return <Button.Group>{nodes}</Button.Group>
      }
      return <>{nodes}</>
    }
  }
  return null
}

const toolbar = {
  build: (props: IUdTableProps, tableDOM: HTMLDivElement | undefined, columns: ColumnProps<any>[], columnsConfigChange: (items: ICustomColumnsItem[]) => void) => {
    if (!tableDOM) {
      return
    }
    let leftBtns = buildToolbarBtns(props.leftBtns)
    let exportBtn = exporter.buildExportBtns(props, tableDOM, columns)
    let mores = exportBtn ? [exportBtn] : []
    if (props.useColumnCustomize && props.tableKey) {
      mores.push(<UdTableColumnCustomize key="column-customize" tableKey={props.tableKey} columns={columns as any} onChange={columnsConfigChange} />)
    }
    let rigthBtns = buildToolbarBtns(props.rigthBtns, mores)
    const showToolbar = leftBtns || rigthBtns
    if (showToolbar) {
      let toolbar = <UdToolbar other={leftBtns}>{rigthBtns}</UdToolbar>
      if (props.useToolbarAffix) {
        return <Affix offsetTop={40} target={() => props.pageContainer!}>{toolbar}</Affix>
      }
      return toolbar
    }
  }
}

export { toolbar }
