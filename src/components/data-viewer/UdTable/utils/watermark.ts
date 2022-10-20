import _ from 'lodash'
import { udConfigProvider, ITableWatermark } from '../../../..'

function addInner(options: IWatermarkAdd) {
  try {
    let container = options.parent.querySelector('.ant-table-content')
    if (container) {
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}px" height="${options.height}px">
          <text x="${options.x}" y="${options.y}" dy="${options.fontSize}px"
              text-anchor="start"
              stroke="${options.color}"
              stroke-opacity="${options.opacity}"
              transform="rotate(${options.angle},10 40)"
              fill="none"
              font-weight="100"
              font-size="${options.fontSize}px"
              >
              ${options.text}
          </text>
      </svg>`
      let img = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`
      let watermark = document.createElement('div')
      watermark.style.position = 'absolute'
      watermark.style.top = '0px'
      watermark.style.bottom = '0px'
      watermark.style.left = '0px'
      watermark.style.right = '0px'
      watermark.style.pointerEvents = 'none'
      watermark.style.zIndex = '1'
      watermark.style.backgroundImage = 'url(' + img + ')'
      container.insertBefore(watermark, container.childNodes[0])
    }
  } catch (e) {
    console.error('添加水印失败', e)
  }
}

/**
 * 水印
 */
const watermark = {
  addToTable: (tableRef: HTMLDivElement, config?: ITableWatermark) => {
    let cfg = _.defaultsDeep({}, config, udConfigProvider.ui.table.watermark)
    if (cfg.enable) {
      cfg.parent = tableRef
      if (_.isFunction(cfg.text)) {
        cfg.text = cfg.text()
      }
      addInner(cfg)
    }
  }
}

export interface IWatermarkAdd {
  parent: HTMLElement
  color: string
  opacity: number
  fontSize: number
  angle: number
  text: string
  width: number
  height: number
  x: number
  y: number
}

export { watermark }
