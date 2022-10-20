
import React, { useState } from 'react'
import { Input } from 'antd'
import { useDebounce } from '../index'

const Demo: React.FC = () => {

  const [value, setValue] = useState<string>()
  const debouncedValue = useDebounce(value, 500)

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入"
        style={{ width: 280 }}
      />
      <p style={{ marginTop: 16 }}>延迟展示的值: {debouncedValue}</p>
    </div>
  )
}

export default Demo
