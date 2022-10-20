import React, { useRef } from 'react'
import { withRouter } from 'react-router'
import { ISequencePageRequestVo, IUdPaginationConfig, UdSequencePager } from '../../../..'

const Demo = () => {

  const patinaton: IUdPaginationConfig = {
    pageSize: 10,
    hasNext: true,
    hasPrevious: true

  }

  return <UdSequencePager
    pageSize={patinaton.pageSize}
    pageSizeOption={patinaton.pageSizeOptions}
    hasNext={patinaton.hasNext}
    hasPrevious={patinaton.hasPrevious}
    lastDataId={patinaton.lastDataId}
    firstDataId={patinaton.firstDataId}
    numberOfElements={patinaton.numberOfElements}
    onChange={(value) => {
      console.log(value)
      // 发起搜索
    }}
  />
}

// 如果是通过 react-router 加载的此组件，无须用 withRouter 包一次。
export default withRouter(Demo)
