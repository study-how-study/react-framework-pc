import React, { Component } from 'react'
import { IUdMessageInfo, udConfigProvider, UdMessageNotice } from '../../../..'

interface IbasicProps {
}

interface IbasicState {
}

const addTimeStamp = (path: string) => {
  if (!path) {
    return path
  }
  const timestampString = new Date().valueOf().toString()
  if (path.indexOf('?') > -1) {
    const arr = path.split('?')
    let str = arr[0] + '?timestamp=' + timestampString + '&' + (arr[1] || '')
    return str
  } else {
    return path + '?timestamp=' + timestampString
  }
}

const token = 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNpUkMtqwzAQRf9l1jaMjPyQdyaU0kVDF-3OEMbK2JGxJWPLtCHk36s6CTQbLXTPuRrNBfhnglJkqUpFItIkAprMwZ8nhhLeq331-gIRLKazB29GvqMoVZoUGGjtrGfrA3yp_9TPYNZQ1ne3hqiGxa2z5o_Z9az9zh1vwEr0L62maTCavHH2kcYdef6m80bpwYRn3o5P6rrwbGm89YVxZCLzLRhcZ-zuRNbysDkiXFry60zDlzWPHqUKFJjnMhNSYlgAbnbvmv06Njw_917DInpvwlcTkk1G2MTI4ZCYtXGTC45Rt1Kh0m3WFnD9BQAA__8.QPENI3YG3WcYj-I7F3vHCvhU0oP-FopjdfTUfL_h9pY'


udConfigProvider.http.requestBefore = (data) => {
  data.headers.authorization = token
  return data
}

class basic extends Component<IbasicProps, IbasicState> {

  constructor(props: IbasicProps) {
    super(props)
    this.state = {}
  }



  render() {
    return <UdMessageNotice
      gatewayUrl={"https://message-bus-test.19k8s.cn"}
      userIdentification={'8024247'}
      userIdentificationName='唐宇'
      token={() => { return token }}
      storeCode={'W031'}
      pannelPopConfig={{
        mouseEnterDelay: 0.3,
        mouseLeaveDelay: 0.5
      }}
      onLinkTap={(link, message) => {
        let linkUrl = link.url
        if (linkUrl && linkUrl.startsWith('#/')) {
          const arr = linkUrl.split('#/')
          let path = addTimeStamp(arr[1] || '')

          linkUrl = 'https://manage-test.test1919.cn/manage/index.html' + '#/system/' + (message.sourceProjectCode) + '/' + encodeURIComponent(path)
          console.log(linkUrl, '链接拼接后完整路径')
          return linkUrl
        }
        linkUrl = addTimeStamp(linkUrl)
        const arr = linkUrl.split('#/')
        linkUrl = arr[0] + '#/' + encodeURIComponent(arr[1])
        console.log(linkUrl, '链接拼接后完整路径')
        return linkUrl
      }}
      messageSourceSystem={() => {
        return new Promise((resolve, reject) => {
          resolve([
            { label: '测试', value: 'flow-center' },
            { label: '测试2', value: 'flow-center2' },
            { label: '测试3', value: 'flow-center3' },
            { label: '测试4', value: 'flow-center4' },
            { label: '测试5', value: 'flow-center5' },
            { label: '测试6', value: 'flow-center6' },
            { label: '测试7', value: 'flow-center7' },
            { label: '测试8', value: 'flow-center8' },
            { label: '测试9', value: 'flow-center9' },
            { label: '测试10', value: 'flow-center10' },
          ])
        })
      }}
      maxReConnectTimes={3}
    />
  }

}


export default basic
