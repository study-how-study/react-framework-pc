import _ from 'lodash'
import React, { ReactNode } from 'react'
import { IUdMsgLink, IUdMessageInfo } from '../..'
import msgHanlder from '../../messageHanlder'
import { turnPage } from '../../utils'

const MsgPopupContent: React.FC<IMsgPopupContentProps> = (props) => {
  let { title, content, links } = props.content


  const linkTo = (link: IUdMsgLink, type: 'INNER_LINK' | 'BLANK_LINK') => {
    const url = msgHanlder.option.onLinkTap ? msgHanlder.option.onLinkTap(link, props.content) : link.url
    if (!url) {
      return false
    }

    turnPage(url, type)
  }

  const renderBtns = (links: IUdMsgLink[]) => {
    return links.map((link, index) => {
      let node: ReactNode = null
      const type = link.type
      let linkUrl = link.url
      console.log(linkUrl)

      switch (type) {
        case 'INNER_LINK':
          if (msgHanlder.option.onLinkTap) {
            node = <a key={index} onClick={() => {
              props.onClose()
              linkTo(link, 'INNER_LINK')
            }} style={{ color: '#26d7eb' }} >{link.title}</a>
          } else {
            node = <a href={linkUrl} key={index} onClick={() => { props.onClose() }} style={{ color: '#26d7eb' }} >{link.title}</a>
          }
          break;
        case 'BLANK_LINK':
          if (msgHanlder.option.onLinkTap) {
            node = <a key={index} onClick={() => {
              props.onClose()
              linkTo(link, 'BLANK_LINK')
            }} style={{ color: '#26d7eb' }} >{link.title}</a>
          } else {
            node = <a href={linkUrl} key={index} target='_blank' onClick={() => { props.onClose() }} style={{ color: '#26d7eb' }} >{link.title}</a>
          }
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
    if (content.length >= 150) {
      return content.substring(0, 150) + '...'
    } else {
      return content
    }
  }

  return (
    <div className="msg-popup-content" onClick={props.onContentClick}>
      <div className="mian" dangerouslySetInnerHTML={{ __html: handleContent(content) }} title={content}></div>

      {
        ((links && links.length) || props.content.autoCloseDuration == -1) &&
        <div className="op-bar">
          <div className="bar-left">
            {/* <a key='close-all-popup' onClick={() => { props.onCloseAll() }} >关闭全部</a> */}
          </div>

          <div className="bar-right">
            {links && links.length && renderBtns(links)}
            {
              <a onClick={() => { props.onClose() }} style={{ color: '#666' }} >{'知道了'}</a>
            }
          </div>
        </div>
      }


    </div>
  )
}

interface IMsgPopupContentProps {
  content: IUdMessageInfo
  onClose: () => void
  onContentClick: () => void
  onCloseAll: () => void
  // onLinkTap?: (link: IUdMsgLink, message: IUdMessageInfo) => string | false
}

export default MsgPopupContent