import React, { useState } from 'react'
import { Button, Input } from 'antd'
import { useThrottle } from '../index'

const Demo: React.FC = () => {
  const [value, setValue] = useState<string>()
  const throttledValue = useThrottle(value, 3000)

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='请输入' style={{ width: 280 }} />
      <p style={{ marginTop: 16 }}>节流后的输出值: {throttledValue}</p>
    </div>
  );
}

export default Demo