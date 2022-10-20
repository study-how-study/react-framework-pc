import React from 'react'
import { Spin } from 'antd'

/**
 * 路由加载动画
 */
const UdRouterFallback: React.FC = () => {
  return (
    <div className="ud-router-fallback"><Spin /></div>
  )
}

export { UdRouterFallback }
