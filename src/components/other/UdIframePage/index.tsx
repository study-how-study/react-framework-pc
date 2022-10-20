import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { routeUtils, uaaApp } from '../../..'

/**
 * UdIframePage
 */
const UdIframePage: React.FC<IUdIframePage> = (props) => {
  const [iframeUrl, setIframeUrl] = useState<string>('')
  const location = useLocation()

  const findJumpUrl = () => {
    const pathObj = routeUtils.parsePath(location.search)
    if (pathObj.query && pathObj.query !== '') {
      const query = new URLSearchParams(pathObj.query)
      const customId = query.get('customId')

      if (customId && _.isString(customId)) {
        const sysInfo = uaaApp.getSysInfo()
        const currentCustomData = uaaApp.customIdMap.get(customId)
        let link = _.get(currentCustomData, 'link', '')
        if (currentCustomData && link && link !== '') {
          if (sysInfo && sysInfo.webUrls) {

            let url = _.template(link)
            const completeWebUrl = url(sysInfo.webUrls)
            setUrl(completeWebUrl)
          
          }
        } else {
          console.error('未找到跳转路径')
        }
      } else {
        throw new Error('customId 不能为空')
      }
    }
  }

  const setUrl = (url: string) => {
    let uri = new URL(url)  
    let params = new URLSearchParams(uri.search)
    if (!params.has('fromOtherSystem')) {
      params.set('fromOtherSystem', 'true')
    }
    const newUrl = `${uri}?${params.toString()}`
    setIframeUrl(newUrl)
  }

  useEffect(() => {
    findJumpUrl()
  }, [])

  return (
    <div className="ud-iframe-page">
      <iframe className="iframe" src={iframeUrl} />
    </div>
  )
}

export interface IUdIframePage {

}

export { UdIframePage }
