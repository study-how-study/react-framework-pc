import React, { useState, useEffect } from 'react'
import { Collapse } from 'antd'
import { IDocDemoMeta } from '../../typings'
import { CodeViewer } from '../CodeViewer'
import { useBaseListPage, useBaseDetailPage, BaseListPage, BaseDetailPage } from '../../../../src'
import './DemoViewer.less'

const { Panel } = Collapse

useBaseListPage.defaultConfig.saveParamsWithUrl = false
useBaseListPage.defaultConfig.useHeaderAffix = false
useBaseListPage.defaultConfig.tableProps = { useToolbarAffix: false }

BaseListPage.defaultStates.saveParamsWithUrl = false
BaseListPage.defaultStates.useHeaderAffix = false
BaseListPage.defaultStates.tableProps.useToolbarAffix = false

useBaseDetailPage.defaultConfig.useBackTop = false
useBaseDetailPage.defaultConfig.useHeaderAffix = false
useBaseDetailPage.defaultConfig.useFooterAffix = false

BaseDetailPage.defaultStates.useBackTop = false
BaseDetailPage.defaultStates.useHeaderAffix = false
BaseDetailPage.defaultStates.useFooterAffix = false

const DemoViewer: React.FC<IDemoViewerProps> = (props) => {

  const code = props.define.obj.showCode
  const DemoComponent = props.define.default

  return (
    <div className="demo-viewer">
      <div className="title">
        <h3>{props.meta.title}</h3>
        <span>{props.meta.desc}</span>
        <a href={props.meta.repoFileUrl} target="_blank">源文件</a>
      </div>
      <div className="run-box">
        {DemoComponent && <DemoComponent />}
      </div>
      <Collapse>
        <Panel header="显示代码" key="1">
          <CodeViewer code={code} />
        </Panel>
      </Collapse>

    </div>
  )
}

interface IDemoViewerProps {
  meta: IDocDemoMeta
  define: any
}

export { DemoViewer }
