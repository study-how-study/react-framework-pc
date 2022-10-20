import _ from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'
import { IColumnActions } from '../../typings'
import { Dropdown, Menu, Switch, Tooltip } from 'antd'
import { uaaApp } from '../../core/uaaApp'


let columnRenders = {

  title: (to: string, text?: string) => {
    let compiledTo = _.template(to)
    let compliedText: any
    if (text) {
      compliedText = _.template(text)
    }
    return (text: any, record: any, index: number): React.ReactNode => {
      let path = compiledTo(record)
      return <div className="td-title">
        <a onClick={() => {
          location.hash = path
        }}>{compliedText ? compliedText(record) : text}</a>
      </div>
    }
  },
  enum: (items: { [key in any]: any }, defaultValue?: '--') => {
    return (text: any): React.ReactNode => {
      return items[text] == null ? defaultValue : items[text]
    }
  },

  datetime: (format: string = 'YYYY-MM-DD HH:mm:ss') => {
    return (text: any, record: any, index: number): React.ReactNode => {
      return <span>{text ? moment(text).format(format) : ''}</span>
    }
  },
  switch: () => {
    return (text: any, record: any, index: number): React.ReactNode => {
      let loading = false
      let checked = false
      return <Switch defaultChecked={checked} checkedChildren={'开'} loading={loading} unCheckedChildren={'关'} onChange={(e) => {
        loading = true
        setTimeout(() => {
          loading = false
          checked = true
        }, 2000)
      }} />
    }
  },

  maxShowLength: (maxLength: number = 200, showTooltip: boolean = true) => {
    return (text: any, record: any, index: number): React.ReactNode => {
      const str: any = text.substring(0, maxLength) + (text.length <= maxLength ? '' : '...')
      return !showTooltip ? str : <Tooltip placement="topLeft" title={text.length > 1000 ? '由于该内容过长请在详情页面查看' : text}>
        {str}
      </Tooltip>
    }
  },

  operate: function (actions: IColumnActions[], showLimit: number = 3) {
    return (text: any, model: any, index: number): React.ReactNode => {
      let links = []
      let mores = null
      let showActions: any[] = []
      for (let i = 0; i < actions.length; i++) {
        if (_.isFunction(actions[i].show) && (actions[i] as any).show(text, model, index) === false) {
          continue
        }
        if (actions[i].auth) {
          if (_.isFunction(actions[i].auth) && (actions[i].auth as any)(text, model, index) === false) {
            continue
          }
          if (_.isString(actions[i].auth) && uaaApp.canUse(actions[i].auth as string) === false) {
            continue
          }
        }
        showActions.push(actions[i])
      }
      let hasMore = showActions.length > showLimit
      let endIndex = hasMore ? showLimit - 1 : showActions.length
      for (let i = 0; i < endIndex; i++) {
        links.push(<a key={i} onClick={() => { showActions[i].action.call(this, text, model, index) }}>{showActions[i].title}</a>)
      }
      if (hasMore) {
        let menuItems = []
        for (let i = endIndex; i < showActions.length; i++) {
          menuItems.push((
            <Menu.Item key={i}>
              <a onClick={() => { showActions[i].action.call(this, text, model, index) }}>{showActions[i].title}</a>
            </Menu.Item>
          ))
        }
        mores = (
          <Dropdown overlay={(
            <Menu>{menuItems}</Menu>
          )} placement="bottomRight">
            <a className="ant-dropdown-link">
              更多
               {/* <Icon type="down" /> */}
            </a>
          </Dropdown>
        )
      }
      return (
        <div className={'td-operate'}>
          {links}
          {mores}
        </div>
      )
    }
  }

}


export { columnRenders }
