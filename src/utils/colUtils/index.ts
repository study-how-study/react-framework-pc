import _ from 'lodash'
import { IColSpan } from '../..'

const colUtils = {
  /**
   * 计算span
   * @param containerWidth 容器宽度
   * @param col 响应定义
   * @param defaultValue 默认值
   */
  calcSpan: (containerWidth: number | undefined, col: IColSpan, defaultValue: number): number => {
    if (containerWidth == null) {
      containerWidth = window.innerWidth
    }
    if (containerWidth >= 1600 && col.xxl) {
      return col.xxl
    }
    if (containerWidth >= 1200 && col.xl) {
      return col.xl
    }
    if (containerWidth >= 992 && col.lg) {
      return col.lg
    }
    if (containerWidth >= 768 && col.md) {
      return col.md
    }
    if (containerWidth >= 576 && col.sm) {
      return col.sm
    }
    if (col.xs) {
      return col.xs
    }
    if (col.span) {
      return col.span
    }
    return defaultValue
  }
}

export { colUtils }
