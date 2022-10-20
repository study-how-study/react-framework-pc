import React from 'react'
import { withRouter } from 'react-router'
import { BaseListPage, http, IBaseListPageProps, udConfigProvider, useBaseListPage } from '../../../..'

const Demo: React.FC = () => {
  const { render } = useBaseListPage({
    title: '在列表页hook版本中使用',
    queryApi: 'http://10.4.100.71:7300/mock/618a264ca659b100215c5a3d/sequence-pager/list',

    // queryApi: (data) => {
    //   return http.post('https://test-push.1919.cn/manage/v1/agreement/soa/agreementInformRecordService/queryAgreementInformRecordPage', data, {
    //     headers: {
    //       authorization: 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNpUj8sKwjAQRf9l1i00tkna7oqIuFBcuAzIkMYS0SS0U7SI_258gW5mc8-ZuXMDcw1QM1FkucwkKxLAYPc0BQM1rJtNs1xAAoPt3J7s2TzRvKpkyYqyZCIB7R0ZRxG-qae6i6aCWn1cBYmCwY-9NtveH42muW_fwIj4kzYhnKxGst5907RDMhecXpQ-2Xhm1f6p42B6h-f3PkLXTaOCe-x7JBsbcSbaCss8FbFqWsQnUzzwODSXcpbNOOMC7g8AAAD__w.ziVBEoG8p2_iXOFxAvo__fjtlj_4X6CCnpogapys_N0'
    //     }
    //   })
    // },
    saveParamsWithUrl: true,
    conditions: [
      { name: 'platformPayNo', label: '平台支付单号' },
    ],
    rowKey: 'id',
    columns: [
      { title: '平台支付单号', dataIndex: 'platformPayNo', minWidth: '150px', },
      { title: '商户支付单号', dataIndex: 'merchantPayNo', minWidth: '150px', },
      { title: '第三方支付单号', dataIndex: 'thirdPayNo', minWidth: '150px', },
      {
        title: '支付金额', dataIndex: 'totalAmount', minWidth: '100px',
        render: (text: any, record: any, index: number) => {
          return <div>{(text / 100).toFixed(2)}</div>
        }
      },
      { title: '状态', dataIndex: 'payStatusLabel', minWidth: '80px' },
      {
        title: '来源', dataIndex: 'requestSource', minWidth: '80px',
        render: (text: any, record: any, index: number) => {
          return <div>{text}</div>
        }
      },
    ],
    /* 配置使用简单分页 */
    paginationModel: 'SEQUENCE_PAGER',
    /* 配置简单分页器的每页大小 */
    pagination: {
      pageSizeOptions: ['10', '25', '30', '35', '40', '45', '50']
    }
  })
  return render()
}


// 如果是通过 react-router 加载的此组件，无须用 withRouter 包一次。
export default withRouter(Demo)
