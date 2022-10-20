import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import MessageItem from './MessageItem';
import msgHanlder from '../messageHanlder';
import { http } from '../../../../core';
import { ISequencePageRequestVo, UdSequencePager } from '../../UdSequencePager';
import MessageSuperSearch, { IMessageSuperSearchApi } from './MessageSuperSearch';
import { IUdMessageServiceApis } from '../../..';

const ModalMessageCard: ForwardRefRenderFunction<IUdMessageCardModalApi, IModalMessageCardProps> = (props, ref) => {
  const defaultPagination: IPagination = {
    hasNext: false,
    hasPrevious: false,
    firstDataId: null,
    lastDataId: null,
    pageSize: 10,
    numberOfElements: 0
  }
  const defaultQueryParams: IQueryParams = {
    size: 10,
    direction: 'NEXT',
    dataId: '',
    readed: 'unread'
  }
  const [querying, setQuerying] = useState<boolean>(false)
  const [readedList, setReadedList] = useState<string[]>([])
  const [originData, setOriginData] = useState<any[]>([])
  const dataSource = useMemo(() => {
    if (!originData?.length && readedList?.length) {
      return originData
    }
    return originData.map(item => {
      if (readedList.includes(item.id)) {
        item.readed = true
      }
      return item
    })
  }, [originData, readedList])
  const [filterStatus, setFilterStatus] = useState<string>('unread')
  const [pagination, setPagination] = useState<IPagination>(defaultPagination)
  const queryParams = useRef<IQueryParams>({
    size: 10,
    direction: 'NEXT',
    dataId: '',
  })
  const superSearchRef = useRef<IMessageSuperSearchApi>()
  const [useSuperSearch, setUseSuperSearch] = useState<boolean>(false)
  useEffect(() => {
    query(defaultQueryParams)
  }, []);

  const getQueryParams = (values) => {
    queryParams.current = { ...queryParams.current, ...values, storeCode: props.storeCode }
    const params = { ...queryParams.current }
    if (params.readed === 'readed') {
      params.readed = 'true'
    } else if (params.readed === 'unread') {
      params.readed = 'false'
    } else {
      params.readed = null
    }
    if(params.createTime?.length) {
      params.startDateTime = params.createTime[0]
      params.endDateTime = params.createTime[1]
      delete params.createTime
    }
    return params
  }

  const query = (values) => {
    // TODO:增加默认搜索条件-限制自己和已读状态
    setQuerying(true)
    setOriginData([])
    const apiPath = props.serviceApis?.messageList || '/manage/v1/messageBus/MessageStore/querySequencePageByCurrentUser'
    const url = props.gatewayUrl + apiPath
    const params = getQueryParams(values)
    http.post(url, params).then((res) => {
      const resData = res.data || {}
      const paginationRes: IPagination = {} as IPagination
      paginationRes.hasPrevious = resData.hasPrevious
      paginationRes.hasNext = resData.hasNext
      paginationRes.firstDataId = resData.firstDataId
      paginationRes.lastDataId = resData.lastDataId
      paginationRes.pageSize = resData.size
      paginationRes.numberOfElements = resData.numberOfElements
      setPagination(paginationRes)
      setOriginData(resData.content || [])
    }).finally(() => {
      setQuerying(false)
    })
  }

  const handleSearch = (values?: any) => {
    queryParams.current = { ...defaultQueryParams }
    query({ ...defaultQueryParams, ...values || {} })
  }
  /**
   * 打开高级搜索
   */
  const superSearch = () => {
    // TODO:
    setUseSuperSearch(true)
    superSearchRef.current && superSearchRef.current.setVisible(true)
  }

  const confirmReadAll = () => {
    Modal.warning({
      title: '提示',
      content: '已读的消息上线后将不会主动推送，确定将全部消息变更为已读吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // TODO
      }
    })
  }


  useImperativeHandle(ref, () => {
    return {
      setReadList: (messageIds) => {
        setReadedList(messageIds)
      }
    }
  })


  return <Spin spinning={querying}><div className='ud-message-card-modal-content'>
    <div className="toolbar">
      <div className="left">
        {
          !useSuperSearch &&
          <>
            <Select className='status-select' value={filterStatus} onChange={(value) => { setFilterStatus(value) }}>
              <Select.Option key='all' value='all'>全部</Select.Option>
              <Select.Option key='readed' value='readed'>已读</Select.Option>
              <Select.Option key='unread' value='unread'>未读</Select.Option>
            </Select>
            <Button type='primary' onClick={() => {
              handleSearch({ readed: filterStatus })
            }}>搜索</Button>
          </>
        }

      </div>
      <div className="right">
        {
          !useSuperSearch &&
          <Button onClick={() => { superSearch() }}>高级搜索</Button>
        }
        {/* <Button onClick={()=> {confirmReadAll()}}>全部确认已读</Button> */}
      </div>
    </div>
    <MessageSuperSearch
      ref={superSearchRef}
      onVisibleChange={(value) => { setUseSuperSearch(value) }}
      onSearch={(values) => handleSearch(values)}
      messageSourceSystem={props.messageSourceSystem}
    />
    <div className="message-list">
      {
        (dataSource && dataSource.length > 0) ?
          <div>
            {
              dataSource.map(item => <div onClick={() => {
                if (item.readed) {
                  return
                }
                msgHanlder.option.onConfirmRead([item.id])
              }}>
                <MessageItem data={item} />
              </div>)
            }
          </div>
          :
          (
            querying ? null : <div className="empty"><div style={{ textAlign: 'center', width: '100%' }}>暂无数据</div></div>
          )
      }
    </div>
    <div className="message-pager">
      <UdSequencePager
        numberOfElements={pagination.numberOfElements}
        firstDataId={pagination.firstDataId}
        lastDataId={pagination.lastDataId}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        pageSize={pagination.pageSize}
        onChange={(values) => {
          query(values)
        }}
      />
    </div>
  </div>
  </Spin>

}

interface IModalMessageCardProps {
  // 消息列表
  gatewayUrl: string
  userIdentification: string | number
  storeCode: any
  messageSourceSystem?: any[] | (() => Promise<any[]>)
  serviceApis?: IUdMessageServiceApis
}

interface IPagination {
  hasPrevious: boolean,
  hasNext: boolean,
  firstDataId: number | string | null,
  lastDataId: number | string | null,
  pageSize: number,
  numberOfElements: number | null
}
interface IQueryParams extends ISequencePageRequestVo {
  [key: string]: any
}

export interface IUdMessageCardModalApi {
  setReadList: (messageIds: string[]) => void
}

export default forwardRef(ModalMessageCard);
