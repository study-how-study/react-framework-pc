import _ from "lodash"
import { useContext } from "react"
import { ModalMessageCardContext } from "."
import { centerMsgBus, http } from "../../../.."
import { BASE_TAG_AND_TOPIC, CONFIRM_ALL_MESSAGES_URL, CONFIRM_MESSAGE_URL, GET_MESSAGE_URL } from "./constants"

export const getMessage = (data, context) => {
  const url = centerMsgBus.baseURL + context.webMsgServiceOption.getMessageUrl
  const defaultData = {
    confirmStatus: "ALL",
    size: 10,
    topic: context.msgModel.topic,
    tag: context.msgModel.tag,
  }
  const finalData = {
    ...defaultData,
    ..._.omit(data, 'projectCode'),
    ...data.projectCode && {
      sender: {
        projectCode: data.projectCode,
      }
    }
  }

  const f = _.pickBy(finalData, _.identity);

  return http.post(url, f, {
    params: {
      ...centerMsgBus.baseParams,
    }
  })
}

export const confirmMessage = (messageIds, context) => {
  const url = centerMsgBus.baseURL + context.webMsgServiceOption.confirmUrl
  const defaultData = {
    topic: context.msgModel.topic,
    tag: context.msgModel.tag,
  }
  const finalData = {
    ...defaultData,
    messageIds
  }


  return http.post(url, finalData, { params: centerMsgBus.baseParams })
}

export const confirmMessageAll = (context) => {
  const url = centerMsgBus.baseURL + context.webMsgServiceOption.confirmAllUrl
  const defaultData = {
    topic: context.msgModel.topic,
    tag: context.msgModel.tag,
  }
  const finalData = {
    ...defaultData,
    messageIds: [0]
  }


  return http.post(url, finalData, { params: centerMsgBus.baseParams })
}