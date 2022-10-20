import React from 'react'
import UdLocalLogin from '../index' // 实际代码不应该这样引入此组件，这里仅示意。

const Demo: React.FC = () => {
  return <UdLocalLogin loginApiBaseUrl={'https://uaa-test.1919.cn'} username={'huyao'} />
}

export default Demo
