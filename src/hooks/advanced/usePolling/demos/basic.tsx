import { Button, message } from "antd"
import React from "react"
import { usePolling } from ".."

const Basic = () => {
  const { start, stop } = usePolling({
    action: () => {
      console.log('执行轮询请求')
      message.success('发起轮询请求')
      const result = Math.random()
      if (result < 0.9) {
        // 模拟请求成功
        return Promise.resolve({ data: result })
      } else {
        // 模拟请求失败
        return Promise.reject({ data: result })
      }
    },
    shouldContinue: (res) => {
      console.log(res.data)
      if (res.data < 0.1) {
        message.warning('轮询停止')
      }
      return res.data >= 0.1
    },
    handleDurction: (duration, times) => {
      return duration
    },
    duration: 3000
  })
  return (
    <>
      <p><Button onClick={() => { start() }}>开始</Button></p>
      <p><Button onClick={() => { stop() }}>停止</Button></p>
    </>
  )
}
export default Basic