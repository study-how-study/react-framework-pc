import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import './AnchorBar.less'

const HEADERHEIGHT = 0

const AnchorBar: React.FC<IAnchorBarProps> = (props) => {

  const [activeId, setActiveId] = useState(props.listData[0] ? props.listData[0].id : '')
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    const list = props.listData || []
    const data = _.sortBy(list, (item) => document.getElementById(item.id) ? document.getElementById(item.id).offsetTop : 0)
    const root = document.scrollingElement
    if (root) {
      scroll(HEADERHEIGHT)
      window.onscroll = (e) => {
        let target: any = e.target
        let offsetTopObjs: any[] = []
        list.map((item: IListData) => {
          let obj = {
            id: item.id,
            title: item.title,
            // offsetTop: document.getElementById(item.id) ? document.getElementById(item.id).offsetTop : 0
            offsetTop: document.getElementById(item.id) && document.getElementById(item.id).offsetTop
          }
          offsetTopObjs.push(obj)
        })
        offsetTopObjs = _.sortBy(offsetTopObjs, ['offsetTop'])
        let targetBar = _.find(offsetTopObjs, (item) => (item.offsetTop - HEADERHEIGHT) >= target.scrollingElement.scrollTop)
        if (targetBar) {
          setActiveId(targetBar.id)
        }
      }
    }

    setDataSource(data)
  }, [props.listData])


  function scroll(scrollTop: number) {
    const root = document.scrollingElement
    if (root) {
      root.scrollTop = scrollTop
    }
  }

  return (
    <div className="anchor-bar">
      {dataSource.map((item: IListData) => (
        <p
          key={item.id}
          title={item.title}
          className={classNames({ 'active': item.id == activeId, 'child-tag': item.tagName == 'H3' })}
          onClick={() => {
            const ele = document.getElementById(item.id)
            if (ele) {
              const scrollTop = ele.offsetTop - HEADERHEIGHT
              scroll(scrollTop)
              setActiveId(item.id)
            }
          }}>
          {item.title}
        </p>
      ))}
    </div>
  )
}

interface IListData {
  id: string
  title: string
  tagName: string
}

interface IAnchorBarProps {
  listData: IListData[]
  // containerId: string
}

export { AnchorBar }