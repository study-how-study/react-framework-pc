/**
 * title: 监测整页的滚动
 * desc: 页面滚动一下。
 */
import React from 'react'
import { useScroll } from '../index'

export default () => {
  const scroll = useScroll(document)
  return (
    <div>
      <div>{JSON.stringify(scroll)}</div>
    </div>
  )
}