import _ from 'lodash'
import React, { ReactNode } from 'react'
import { IMsgLink, IWebMsgContent } from '../..'
import './index.less'

const MsgPopupContent: React.FC<IMsgPopupContentProps> = (props) => {
  let { title, content, links } = props.content

  const renderBtns = (links: IMsgLink[]) => {
    return links.map((link, index) => {
      let node: ReactNode = null
      const type = link.type
      switch (type) {
        case 'INNER_LINK':
          node = <a href={link.url} key={index} onClick={() => { props.onClose() }}>{link.title}</a>
          break;
        case 'BLANK_LINK':
          node = <a href={link.url} key={index} target='_blank' onClick={() => {
            props.onClose()
          }}>{link.title}</a>
          break;
        case 'CLOSE':
          node = <a key={index} onClick={() => { props.onClose() }} >{link.title}</a>
          break;
        default:
          node = null
      }
      return node
    })
  }

  const handleContent = (content: string) => {
    if (!_.isString(content)) {
      return content
    }
    if (content.length >= 100) {
      return content.substring(0, 100) + '...'
    } else {
      return content
    }
  }

  return (
    <div className="msg-popup-content" onClick={props.onContentClick}>
      <div className="mian" dangerouslySetInnerHTML={{ __html: handleContent(content) }}></div>

      {
        links && links.length &&
        <div className="op-bar">
          <div className="bar-left">
            {/* <a key='close-all-popup' onClick={() => { props.onCloseAll() }} >关闭全部</a> */}
          </div>

          <div className="bar-right">
            {renderBtns(links)}
          </div>
        </div>
      }


    </div>
  )
}

interface IMsgPopupContentProps {
  content: IWebMsgContent
  onClose: () => void
  onContentClick: () => void
  onCloseAll: () => void
}

export default MsgPopupContent