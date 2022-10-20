import _ from 'lodash'
import React, { useRef } from 'react'

let utils = {
  buildMdJson: (items: any[]) => {
    let tagName: string = ''
    let props: any = {}
    let childrens: any[] = []

    for (let i = 0; i < items.length; i++) {
      if (i == 0) {
        if (items[i] == '') {
          return
        }
        tagName = items[i]
        continue
      }
      if (Array.isArray(items[i])) {
        let childrenNode = utils.buildMdJson(items[i])
        childrens.push(childrenNode)
        continue
      }
      if (_.isObject(items[i])) {
        props = items[i]
        if (tagName == 'pre' && props.lang) {
          let mermaid = ['mermaid', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'gantt', 'pie']
          if (mermaid.includes(props.lang)) {
            // 处理各种图形，下面获取 childrens 的代码比较死，可能会有问题。
            props.className = 'mermaid'
            tagName = 'div'
            childrens = _.get(items, '[' + (i + 1) + '][1]', 'markdown 格式有误。')
            break
          } else {
            props.className = `lang-${props.lang}`
          }
        }
        continue
      }
      childrens.push(items[i])
    }
    if (childrens.length == 0) {
      childrens = null
    }
    props.key = useRef(_.uniqueId()).current
    // props.key = _.uniqueId()
    return React.createElement(tagName, props, childrens)
  }
}

export { utils }
