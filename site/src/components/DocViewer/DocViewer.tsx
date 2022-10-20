import _ from 'lodash'
import React, { useState, useLayoutEffect } from 'react'
import mermaid from 'mermaid'
import { utils } from '../../utils'
import { AnchorBar } from '../'
import { IDocItem } from '../../typings'
import { DemoViewer } from '../'
import { useMount } from '../../../../src'
import './DocViewer.less'

const DocViewer: React.FC<IDocViewerProps> = (props) => {
  let { index, demos } = props.doc
  let componentName = index.meta ? index.meta.title : ''
  const [anchorBarList, setAnchorBarList] = useState<any[]>([])

  useMount(() => {
    let timer = setTimeout(() => {
      let { index } = props.doc
      let componentName = index.meta ? index.meta.title : ''
      let pageEle = document.getElementById(componentName)
      if (pageEle) {
        const h2s = pageEle.getElementsByTagName('h2')
        const h3s = pageEle.getElementsByTagName('h3')
        let h2Arr = Array.from(h2s)
        let h3Arr = Array.from(h3s)
        let tagArr = _.concat(h2Arr, h3Arr)
        let barListData: any[] = []
        if (tagArr && tagArr.length > 0) {
          tagArr.map((item, index) => {
            let id = `${componentName}-${item.tagName}-${index}`
            item.setAttribute('id', id)
            let obj = {
              title: item.innerText,
              id: id,
              tagName: item.tagName
            }
            barListData.push(obj)
          })
        }
        setAnchorBarList(barListData)
      }
      mermaid.init();

      (window as any).Prism && (window as any).Prism.highlightAll()
    })
    return () => clearTimeout(timer)
  })
  return (
    <div className="doc-viewer" id={componentName}>
      {anchorBarList.length > 0 && <AnchorBar listData={anchorBarList} />}
      <h1 className="doc-header">
        <span className="title">{index.meta.title}</span>
        <span className="subtitle">{index.meta.subtitle}</span>
        <a href={index.meta.repoFileUrl} target="_blank">源文件</a>
      </h1>
      {utils.buildMdJson(index.content)}
      {
        (index.demos && index.demos.length > 0) && <>
          {/* <h2>例子</h2> */}
          <div className="demo-list">
            {
              index.demos.map((n => {
                let define = demos.find(x => x.key == n.key).require
                return <DemoViewer key={n.key} meta={n} define={define} />
              }))
            }
          </div>
        </>
      }
    </div>
  )
}

interface IDocViewerProps {
  doc: IDocItem,
  containerId: string
}

export { DocViewer }