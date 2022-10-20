import { Button } from "antd"
import _ from "lodash"
import React, { useEffect, useState } from "react"
import { UdMessageNotification } from ".."
import { centerMsgBus, http, udConfigProvider } from "../../../.."
import { PROJECT_CODES } from "../ModalMessageCard/constants"
const token = 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNpskc1OwkAUhd9l1m3SYukPuwou2CgRjAvHNGM7JUP6l3ZQsWHFBmNi2BgWxEcwuDEag_FlLOCKV3Da2oKJSTPNzPnuOffOxABfB6AmypKgVmVNETiAAmLQQYBBDRwftDuG3moCDkSk6xmUuPgXrqiiIkiKyAHT9yj2KMNjmBZ3WC0ENVhWQ8BBEPn90MSt0O9hk9Z9K0cuyA1vYYdc4nCwg-lB4BATUeJ7GcYi0nyXxfBdRPEVymnTIeyoaf3v1Y9w6CE3TxI1UROEvUxgI5MQd0gmbUeXZJmJLqaogShiUpx7ND3bzzxiCCGwcJAmwvSELafCnpj-uUI7TBMLNZnNktfH5XjyPfpY3c9Xk9HX21PyOVpOp-vxc_I-3SzGy5e79fxhs7gtbcjWvmi7kAIcuiSK2MU0sj6ijDzb7eQ8A2kKesgpnfR9vX7SNlpH7dIsHe5PuztpQ_YN2bv3KGEvK9kVZCFk86pgq7ykogqPZEtlW01BcrWqKEgDwx8AAAD__w.WZWDq-qgvOYaKDh8DXzFd9fgRwItaMOYmcVQRIrxp-g'

// udConfigProvider.http.requestBefore = (data) => {
//   data.headers.authorization = token
//   return data
// }

// const 

const Demo = () => {
  const [isInit, setIsInit] = useState<boolean>(false)
  useEffect(() => {
    centerMsgBus.init({
      baseURL: "https://cp-tbs-test.1919.cn",
      clientType: 'UAA-USER',
      projectCode: 'DISTRIBUTION-DESK',
      username: '1919003',
      serviceUrl: {
        registerUrl: '/restapi/v1/clients/register',
        receiveUrl: '/longPulling/restapi/v1/msg/receive',
        sendUrl: '/restapi/v1/msg/send',
        updateSubscribeUrl: '/restapi/v1/clients/updateSubscribeFilters'
      }
    })
    setIsInit(true)
  }, [])
  return <div>
    {
      isInit &&
      <UdMessageNotification
        msgModel={{
          topic: 'POS-STORE-MSG',
          tag: 'W031',
          autoCreateTopic: true
        }}
        // getProjectCodes={() => PROJECT_CODES}
        popupConfig={{
          message: '配送台消息'
        }}
        webMsgServiceOption={{
          getMessageUrl: '/restapi/v1/clients/getMessage',
          offlineUrl: '/restapi/v1/clients/offline',
          confirmUrl: '/restapi/v1/msg/confirm',
          confirmAllUrl: '/restapi/v1/msg/confirmAll',
          unconfirmedCountUrl: '/restapi/v1/msg/unconfirmedCount'
        }}
        msgCardModalProps={{
          width: '600px',
          centered: true,
          bodyStyle: { maxHeight: '600px', overflow: 'scroll' }
        }}
        maxPendingPopupCount={1}
        msgContentHanlder={(content) => {
          if (content.messageKey === 'price_tag_print') {
            if (_.isArray(content.links)) {
              content.links = content.links.map(item => {
                return {
                  ...item,
                  url: item.url + '?code=' + token
                }
              })
            }
          }
          return content
        }}
      />
    }
  </div>
}

export default Demo