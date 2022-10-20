import React from 'react'
import { withRouter } from 'react-router-dom'
import { Pagination, message } from 'antd'
import { BasePage } from '../../../../index'

class Demo extends BasePage {

  /**
   * 必须给每个参数设定合理的默认值
   * 如果没设置默认值，将不会获取此参数
   */
  protected defaultQueryParams: any = {
    page: 1,
    size: 15
  }

  render() {
    return (
      <>
        <p>点击下面分页后，可以试试浏览器的前进、后退、刷新功能，看看效果是什么样的。</p>
        <p>
          <strong>当前页码：{this.queryParams.page}</strong>
        </p>
        <Pagination total={1000} current={this.queryParams.page} showSizeChanger={false} size={this.queryParams.size} onChange={this.change} />
      </>
    )
  }

  private change = (page: number) => {
    this.pushQueryParams({ page: page })
  }

  protected queryParamsChanged = () => {
    message.success('分页：' + this.queryParams.page)
  }

}

// 如果是通过 react-router 加载的此组件，无须用 withRouter 包一次。
export default withRouter(Demo)
