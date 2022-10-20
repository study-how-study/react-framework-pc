import React, { useEffect, useState } from 'react';
import { IUdMessageInfo, IUdMsgLink } from "../index";
import { Card, message, Tabs, Tooltip } from "antd";
import MessageItem from "./MessageItem";
import _ from 'lodash';
import msgHanlder from '../messageHanlder';
import { pannelMsgCountOverCrop } from '../utils';
import { ClearOutlined } from '@ant-design/icons';

interface INoticePanelProps {
  // 消息列表
  messageList: IUdMessageInfo[]
  // 已读列表
  readList: string[]
  // onConfirmRead: (messageIds: string[]) => void
  // onLinkTap?: (link: IUdMsgLink, message: IUdMessageInfo) => string | false
  onShowMore: () => void
  onClearReaded: ()=>void
}

const NoticePanel: React.FC<INoticePanelProps> = (props: INoticePanelProps) => {


  const [todoList, setTodoList] = useState<IUdMessageInfo[]>([]);
  const [noticeList, setNoticeList] = useState<IUdMessageInfo[]>([]);
  const [messageList, setMessageList] = useState<IUdMessageInfo[]>([]);

  useEffect(() => {
    let tempTodoList = [];
    let tempNoticeList = [];
    let tempMessageList = [];
    props.messageList && props.messageList.forEach(message => {
      message.readStatus = (props.readList && props.readList.includes(message.messageId)) ? 'READED' : 'WAIT_READ'
      if (message.category == "TODO") {
        tempTodoList.push(message);
      }
      if (message.category == "NOTICE") {
        tempNoticeList.push(message);
      }
      if (message.category == "MESSAGE") {
        tempMessageList.push(message);
      }
    });

    // setTodoList([...todoList, ...tempTodoList])
    // setNoticeList([...noticeList, ...tempNoticeList])
    // setMessageList([...messageList, ...tempMessageList])

    setTodoList(tempTodoList)
    setNoticeList(tempNoticeList)
    setMessageList(tempMessageList)

  }, [props.messageList, props.readList]);

  const getHasUnread = (list: IUdMessageInfo[]) => {
    const waitReadList = _.filter(list, item => item.readStatus !== 'READED')
    return waitReadList.length>0
  }

  const allConfirmRead = (list: IUdMessageInfo[]) => {
    if (!list || list.length === 0) {
      return
    }
    const msgIds = list.map(item =>{
      if(item.readStatus === 'WAIT_READ') {
        return item.messageId
      }else {
        return null
      }
    }).filter(item=>!!item)
    msgHanlder.option.onConfirmRead(msgIds)
  }

  const showMore = () => {
    props.onShowMore()
  }

  return <div>
    <div className="clear-readed" onClick={()=> {
      props.onClearReaded()
    }}>
      <Tooltip title='清除已读'><ClearOutlined translate={undefined} /></Tooltip>
    </div>
    <Tabs defaultActiveKey="1" centered>
      <Tabs.TabPane tab={<div className={getHasUnread(noticeList) ? 'tab-title with-unread' : 'tab-title'}>通知</div>} key="1">
        <Card style={{ width: 340 }} size={"small"} bordered={false}
          actions={[
            <span onClick={() => { allConfirmRead(noticeList) }}>全部已读</span>,
            <span onClick={() => { showMore() }}>查看更多</span>
          ]}
        >
          {
            pannelMsgCountOverCrop(noticeList, 50).map((item, index) => <MessageItem key={item.messageId} message={item}></MessageItem>)
          }
          {noticeList.length > 50 && <div className='more-msg-tip'>更多消息点击查看更多</div>}
          {
            noticeList.length === 0 && (
              <div className='empty-msg-list'>暂无新通知</div>
            )
          }
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab={<div className={getHasUnread(messageList) ? 'tab-title with-unread' : 'tab-title'}>消息</div>} key="2">
        <Card style={{ width: 340 }} size={"small"} bordered={false}
          actions={[
            <span onClick={() => { allConfirmRead(messageList) }}>全部已读</span>,
            <span onClick={() => { showMore() }}>查看更多</span>
          ]}
        >
          {
            pannelMsgCountOverCrop(messageList, 50).map((item, index) => <MessageItem key={item.messageId} message={item} ></MessageItem>)
          }
          {messageList.length > 50 && <div className='more-msg-tip'>更多消息点击查看更多</div>}
          {
            messageList.length === 0 && (
              <div className='empty-msg-list'>暂无新消息</div>
            )
          }
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab={<div className={getHasUnread(todoList) ? 'tab-title with-unread' : 'tab-title'}>待办</div>} key="3">
        <Card style={{ width: 340 }} size={"small"} bordered={false}
          actions={[
            <span onClick={() => { allConfirmRead(todoList) }}>全部已读</span>,
            <span onClick={() => { showMore() }}>查看更多</span>
          ]}
        >
          {
            pannelMsgCountOverCrop(todoList, 50).map((item, index) => <MessageItem key={item.messageId} message={item}  ></MessageItem>)
          }
          {todoList.length > 50 && <div className='more-msg-tip'>更多消息点击查看更多</div>}
          {
            todoList.length === 0 && (
              <div className='empty-msg-list'>暂无新待办</div>
            )
          }
        </Card>
      </Tabs.TabPane>
    </Tabs>
  </div>;
}

export default NoticePanel;

// TODO: 全部已读、消息数量展示未读数量
