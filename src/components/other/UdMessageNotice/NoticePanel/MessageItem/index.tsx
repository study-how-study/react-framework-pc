import React, { ReactNode, useEffect, useState } from 'react';
import { IUdMsgLink, IUdMessageInfo } from "../../index";
import { Button } from "antd";
import MessageContent from "./components/MessageContent";
import _ from 'lodash';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { turnPage } from '../../utils';
import msgHanlder from '../../messageHanlder';

interface IMessageItemProps {
  message: IUdMessageInfo
  // onConfirmRead: (messageIds: string[]) => void
  // onLinkTap?: (link: IUdMsgLink, message: IUdMessageInfo) => string | false
}

const MessageItem: React.FC<IMessageItemProps> = (props: IMessageItemProps) => {

  const [message] = useState<IUdMessageInfo>(props.message);
  const isCollspanText = props.message.content.length > 60
  const [collspanText, setCollspanText] = useState<boolean>(isCollspanText)



  const handleItemClick = () => {
    if (message.readStatus === 'WAIT_READ') {
      msgHanlder.option.onConfirmRead([message.messageId])
    }
  }

  // useEffect(() => {
  //   const myAudio = document.getElementById(message.messageId)
  //   // console.dir(myAudio)
  //   if (myAudio && message.readStatus === 'WAIT_READ') {
  //     // myAudio.setAttribute('ended', )
  //     // myAudio.ended = () => {
  //     //   props.onConfirmRead([message.messageId])
  //     // }
  //   }

  // }, [message])

  const linkTo = (link: IUdMsgLink, type: 'INNER_LINK' | 'BLANK_LINK') => {
    const url = msgHanlder.option.onLinkTap ? msgHanlder.option.onLinkTap(link, message) : link.url
    if (!url) {
      return false
    }
    turnPage(url, type)
    // if(type === 'INNER_LINK') {
    //   window.location.href = url

    // }else {
    //   window.open(url)
    // }
  }

  const renderBtns = (links: IUdMsgLink[]) => {
    return links.map((link, index) => {
      let node: ReactNode = null
      const type = link.type
      let linkUrl = link.url

      switch (type) {
        case 'INNER_LINK':
          if (msgHanlder.option.onLinkTap) {
            node = <a key={index} onClick={() => {
              handleItemClick()
              linkTo(link, 'INNER_LINK')
            }} style={{ color: '#26d7eb' }} >{link.title}</a>
          } else {
            node = <a href={linkUrl} key={index} onClick={handleItemClick} style={{ color: '#26d7eb' }} >{link.title}</a>
          }
          break;
        case 'BLANK_LINK':
          if (msgHanlder.option.onLinkTap) {
            node = <a key={index} onClick={() => {
              handleItemClick()
              linkTo(link, 'BLANK_LINK')
            }} style={{ color: '#26d7eb' }} >{link.title}</a>
          } else {
            node = <a href={linkUrl} key={index} target='_blank' onClick={handleItemClick} style={{ color: '#26d7eb' }} >{link.title}</a>
          }
          break;
        default:
          node = null
      }
      return node
    })
  }

  const handleContent = (content) => {
    if (!collspanText) {
      return content
    }
    if (!_.isString(content)) {
      return content
    }
    if (content.length >= 60) {
      return content.substring(0, 60) + '...'
    } else {
      return content
    }
  }

  return <>
    <div className={message.readStatus === 'READED' ? 'notice-item message-readed' : 'notice-item message-wati-read'}>
      {message.title && <div className='notic-title' onClick={handleItemClick}>{message.title || ''}</div>}
      {message.readStatus === 'READED' && <span className='message-readed-text'>已读</span>}
      <div className='notic-content' dangerouslySetInnerHTML={{ __html: handleContent(message.content) }} onClick={handleItemClick}></div>
      {
        isCollspanText && (
          <div className='text-collspan-tool' onClick={() => { setCollspanText(!collspanText) }}>
            {collspanText ?
              <DownOutlined translate={undefined} />
              :
              <UpOutlined translate={undefined} />
            }
          </div>
        )
      }
      {
        message.alertTone &&
        //@ts-ignor
        <audio id={message.messageId} src={message.alertTone} controls={true} preload='none'
          style={{ height: '30px', maxWidth: '100%' }}
        // ended={() => {
        //   if (message.readStatus === 'WAIT_READ') {
        //     props.onConfirmRead([message.messageId])
        //   }
        // }}
        />
      }
      {
        message.links && message.links.length > 0 && (
          <div className='notic-links'>
            {renderBtns(message.links)}
          </div>
        )
      }

    </div>
  </>;
}

export default MessageItem;
