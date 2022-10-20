import React, { ReactNode } from "react"
import msgHanlder from "../messageHanlder"
import { IUdMsgLink } from "../typings"
import { turnPage } from "../utils"

const MessageItem = (props: IMessageItemProps) => {
  const linkTo = (link: IUdMsgLink, type: 'INNER_LINK' | 'BLANK_LINK') => {
    const url = msgHanlder.option.onLinkTap ? msgHanlder.option.onLinkTap(link, props.data) : link.url
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
              linkTo(link, 'INNER_LINK')
            }} style={{ color: '#26d7eb' }} >{link.title}</a>
          } else {
            node = <a href={linkUrl} key={index} style={{ color: '#26d7eb' }} >{link.title}</a>
          }
          break;
        case 'BLANK_LINK':
          if (msgHanlder.option.onLinkTap) {
            node = <a key={index} onClick={() => {
              linkTo(link, 'BLANK_LINK')
            }} style={{ color: '#26d7eb' }} >{link.title}</a>
          } else {
            node = <a href={linkUrl} key={index} target='_blank' style={{ color: '#26d7eb' }} >{link.title}</a>
          }
          break;
        default:
          node = null
      }

      return node
    })
  }
  //TODO:

  const msgTypeStyle = {
    'NOTICE': {
      background: '#55AA00',
      color: '#fff'
    },
    'MESSAGE': {
      background: '#9999FF',
      color: '#fff'
    },
    'TODO': {
      background: '#FF7744',
      color: '#fff'
    },
  }
  const typeLableMap = {
    'NOTICE': '通知',
    'MESSAGE': '消息',
    'TODO': '待办'
  }
  return (
    <div className={props.data?.readed ? 'message-item readed' : 'message-item'}>
      {
        props.data?.category &&
        <div className="msg-type" style={msgTypeStyle[props.data.category]}>{typeLableMap[props.data.category]}</div>
      }
      <div className="left">
        <h5 className="title">{props.data.title || ''}</h5>
        <div className="content" dangerouslySetInnerHTML={{__html: props.data.content}}></div>
        {
          props.data?.alertTone &&
          <div className='audio-box'>
            <audio id={props.data?.messageId} src={props.data?.alertTone} controls={true}
              style={{ height: '30px', maxWidth: '400px', width: '100%' }}
            />
          </div>

        }
        {
          props.data?.links?.length &&
          <div className="links">{renderBtns(props.data.links)}</div>
        }
      </div>
      <div className="right">
        {
          props.data?.readed ?
            <span style={{ color: '#aaa' }}>已读</span>
            :
            <a>未读</a>
        }
      </div>
    </div>
  )
}
interface IMessageItemProps {
  data: any
}

export default MessageItem