import React, { useEffect } from 'react'
import { Pagination, message } from 'antd'
import { useUrlQueryParams } from '../../../../index'

const Demo: React.FC = () => {

  let [urlQueryParams, pushUrlQueryParams] = useUrlQueryParams({
    page: 1,
    size: 10
  })

  useEffect(() => {
    message.info(JSON.stringify(urlQueryParams))
  }, [urlQueryParams])

  return (
    <div>
      <p>当前页面：<strong>{urlQueryParams.page}</strong></p>
      <Pagination
        current={urlQueryParams.page} pageSize={urlQueryParams.size} total={1000}
        onShowSizeChange={(current: number, size: number) => {
          pushUrlQueryParams({ size })
        }}
        onChange={(page: number) => {
          pushUrlQueryParams({ page })
        }} />
    </div>
  )
}

export default Demo