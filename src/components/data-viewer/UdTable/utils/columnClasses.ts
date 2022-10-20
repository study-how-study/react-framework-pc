import _ from 'lodash'
import classNames from 'classnames'
import { IUdColumn } from '../typings'

/** className 缓存，避免重复创建。 */
let cache: any = {}

const containerId = 'ud-table-style-container'

let columnsClasses = {
  createStyleContainer: () => {
    const stylesContainer = document.getElementById(containerId)
    if (!stylesContainer) {
      const styleContainer = document.createElement('style')
      styleContainer.id = containerId
      document.head.appendChild(styleContainer)
    }
  },
  setColumnWidthClasses: (column: IUdColumn) => {
    if (_.isString(column.rawTitle) && (column.fixedWidth == null && column.minWidth == null)) {
      // 自动计算列表头的最小宽度，已适应整体表头固定功能。
      // 目前列头的字号为14px，所以这里只是简单的按字符长度来乘以14px。如果是字母的话，结果会超出实际最小宽度。此时可以手动设置该列的最小宽度
      column.minWidth = (column.rawTitle.length * 14) + 'px'
    }
    if (column.minWidth) {
      const name = 'col-min-width-' + column.minWidth
      if (!classNames(column.className).includes(name)) {
        column.className = classNames(column.className, name)
      }
      if (cache[name] == null) {
        cache[name] = `.${name} { min-width:${column.minWidth}; box-sizing: content-box; }`
      }
    }
    if (column.maxWidth) {
      const name = 'col-max-width-' + column.maxWidth
      if (!classNames(column.className).includes(name)) {
        column.className = classNames(column.className, name)
      }
      if (cache[name] == null) {
        cache[name] = `.${name} { max-width:${column.maxWidth}; word-break: keep-all; overflow-wrap: break-word; box-sizing: content-box; }`
      }
    }
    if (column.fixedWidth) {
      const name = 'col-fixed-width-' + column.fixedWidth
      if (!classNames(column.className).includes(name)) {
        column.className = classNames(column.className, name)
      }
      if (cache[name] == null) {
        cache[name] = `.${name} { width:${column.fixedWidth}; min-width:${column.fixedWidth}; max-width:${column.fixedWidth}; box-sizing: content-box; }`
      }
    }
  },
  writeStyles: () => {
    let udTableClassContent: string = ''
    for (let item in cache) {
      udTableClassContent += cache[item]
    }
    let stylesContainer = document.getElementById(containerId)
    if (stylesContainer && udTableClassContent.length > 0 && stylesContainer.innerHTML != udTableClassContent) {
      stylesContainer.innerHTML = udTableClassContent
    }
  }
}

export { columnsClasses }
