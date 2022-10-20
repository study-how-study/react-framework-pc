import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import { PostMessageTypes, uaaApp } from '../../..'
import './style.less'

function useExtraAuthorizeConfigurator<T = any>() {

  let [data, setData] = useState<T>()
  let [initializing, setInitializing] = useState(true)
  let [saving, setSaving] = useState(false)

  useEffect(() => {
    setInitializing(true)
    uaaApp.sendMessage({ type: PostMessageTypes.GetInitData }, (data: T) => {
      setData(data)
      setInitializing(false)
    })
  }, [])

  const save = (data: T) => {
    setSaving(true)
    uaaApp.sendMessage({
      type: PostMessageTypes.SaveMount,
      data: _.isEmpty(data) ? '' : data
    }, () => {
      setSaving(false)
    })
  }

  const render = (slots: {
    body: any
    footer?: any
  }) => (
    <Spin spinning={initializing}>
      <div className="extra-authorize-configurator">
        <div className="extra-authorize-configurator-body">
          {slots.body}
        </div>
        <div className="extra-authorize-configurator-footer">
          {slots.footer || <Button loading={(saving)} type="primary" onClick={() => save(data)}>保存</Button>}
        </div>
      </div>
    </Spin>
  )

  return { initializing, setInitializing, saving, setSaving, data, setData, save, render }
}

export { useExtraAuthorizeConfigurator }