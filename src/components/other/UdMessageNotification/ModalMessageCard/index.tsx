import { Alert, Select } from "antd";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { BASE_TAG_AND_TOPIC } from "./constants";
import { getMessage } from "./requests";
import "./index.less";

import { MessageTable } from "./components/MessageTable";
import { Toolbar } from "./components/ToolBar";
import { reducers } from "./reducers/index";
import { getEmptyValues } from "./utils";
import { IMsgContentHanlder, IWebMsgServiceOption } from "..";
import { centerMsgBus, ICenterMsgBusStatusChange, IMsgBusOnModel } from "../../../..";

const ModalMessageCardContext = createContext([]);
export { ModalMessageCardContext };
const initState: any = reducers();

const ModalMessageCard: React.FC<IModalMessageCardProps> = (
  props: IModalMessageCardProps
) => {
  const { getUnconfirmedMessageCount, getProjectCodes, msgContentHanlder, onReadAll } = props;

  const [serviceStatus, setServiceStatus] = useState<ICenterMsgBusStatusChange>()


  useEffect(() => {
    centerMsgBus.onStatusChange((data) => {
      setServiceStatus(data)
    })
  }, [])


  if (initState.ModalMessageCard) {
    initState.ModalMessageCard.webMsgServiceOption = props.webMsgServiceOption
    initState.ModalMessageCard.msgModel = props.msgModel
    if (getProjectCodes) {
      const projectCodes = getProjectCodes()
      initState.ModalMessageCard.projectCodes = projectCodes
    }

    if (msgContentHanlder) {
      initState.ModalMessageCard.msgContentHanlder = msgContentHanlder
    }
    if (onReadAll) {
      initState.ModalMessageCard.onReadAll = onReadAll
    }

  }

  const reducer = useReducer(reducers, {
    ...initState,

  });

  const isError = ()=> {
    let isError = false
    if(!centerMsgBus.receiving || !centerMsgBus.registered) {
      isError = true
    }

    if(serviceStatus && serviceStatus.status === 'error') {
      isError = true
    }
    return isError
  }





  return (
    <ModalMessageCardContext.Provider value={reducer}>
      {
        isError() && 
        <Alert style={{marginBottom: '12px', padding: '4px 10px', fontSize: '12px'}} message='消息服务异常，请稍后重试' type='error' />
      }
      <Toolbar getUnconfirmedMessageCount={getUnconfirmedMessageCount} />
      <MessageTable getUnconfirmedMessageCount={getUnconfirmedMessageCount} />
    </ModalMessageCardContext.Provider>
  );
};

interface IModalMessageCardProps {
  getUnconfirmedMessageCount: any;
  webMsgServiceOption?: IWebMsgServiceOption
  msgModel?: IMsgBusOnModel
  getProjectCodes?: () => Array<IProjectCode>;
  msgContentHanlder?: IMsgContentHanlder
  onReadAll?: () => void
}

export interface IProjectCode {
  text: string;
  customId: string;
}

export default ModalMessageCard;
