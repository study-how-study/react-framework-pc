import { message } from "antd";
import _ from "lodash";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { ModalMessageCardContext } from "../../..";
import { IMsgLink, isJSON } from "../../../../../../..";
import { confirmMessage, getMessage } from "../../../requests";
import { confirmStatusType } from "../../../types";
import { getIsReadText, getProjectName, shouldHaveNext } from "../../../utils";
import ClampLines from "./Clamp";
import "./MessageTableRow.less";

export const MessageTableRow = (props: IMessageTableRowProps) => {
  const { row, getUnconfirmedMessageCount } = props;
  const [state, dispatch] = useContext(ModalMessageCardContext);
  const {
    content,
    sender: { projectCode, username },
    id,
    enqueueTime,
  } = row;
  const setLoading = (loading) => {
    dispatch({
      type: "SET_LOADING",
      payload: {
        loading,
      },
    });
  };

  const getRowCardContent = (content) => {
    if (isJSON(content)) {
      let data = JSON.parse(content);
      if (_.isFunction(state.ModalMessageCard.msgContentHanlder)) {
        data = state.ModalMessageCard.msgContentHanlder(data)
      }
      return data
    }
    return {
      title: "",
      content,
    };
  };

  const getPrevDataId = () => {
    const { lastDataIdQueue } = state.ModalMessageCard;
    const lastDataIdArray = lastDataIdQueue.fromArray()
    const length = lastDataIdQueue.length()
    return lastDataIdArray[length - 2]
  }

  const renderBtns = (links: IMsgLink[]) => {
    return links.map((link, index) => {
      let node: ReactNode = null
      const type = link.type
      switch (type) {
        case 'INNER_LINK':
          node = <a href={link.url} key={index}>{link.title}</a>
          break;
        case 'BLANK_LINK':
          node = <a href={link.url} key={index} target='_blank'>{link.title}</a>
          break;
        default:
          node = null
      }
      return node
    })
  }

  const handleChangeStatus = (rowIdArray) => {
    setLoading(true);
    return confirmMessage(rowIdArray, state.ModalMessageCard).then((res) => {
      if (res.data === true) {
        const { searchParams, totalDataSource, dataSource, dataId, pagination, lastDataIdQueue } =
          state.ModalMessageCard;
        let params = {
          ...searchParams,
          dataId,
        };
        if (dataSource.length === 1) {

          params = {
            ...searchParams,
            current: pagination.current - 1,
            dataId: getPrevDataId()
          }
          dispatch({
            type: "SET_DATA_ID",
            payload: {
              dataId: getPrevDataId(),
            },
          });
          lastDataIdQueue.pop()
        } else {
          params = {
            ...searchParams,
            dataId: lastDataIdQueue.fromArray()[lastDataIdQueue.length() - 1]
          }
        }



        getMessage(params, state.ModalMessageCard).then((res) => {
          const { data } = res;
          const { lastDataId, content, dataId } = data;

          dispatch({
            type: "SET_LAST_DATA_ID",
            payload: {
              lastDataId,
            },
          });
          dispatch({
            type: "REPLACE_DATASOURCE",
            payload: { dataSource: content },
          });
          const filteredTotal = totalDataSource.slice(0, totalDataSource.length - content.length).concat(content)

          dispatch({
            type: "REPLACE_TOTAL_DATASOURCE",
            payload: { totalDataSource: filteredTotal },
          });

          dispatch({
            type: "SET_PAGINATION",
            payload: {
              pagination: {
                current: dataSource.length === 1 ? pagination.current - 1 : pagination.current,
                hasNext: shouldHaveNext(data),
              },
            },
          });
        });
      }
    });
  };

  let RowCardContent: IRowCardContent = getRowCardContent(content);

  const rowModal = {
    projectName: getProjectName(projectCode),
    username,
    enqueueTime,
    RowCardContent,
  };

  return (
    <div className="MessageTableRow" key={id}>
      <div className="MessageTableRow_title">
        <div>{rowModal.projectName}</div>
        {!!getIsReadText(row.confirmStatus) ? (
          <div
            className="MessageTableRow_title-changeStatus"
            onClick={() => {
              handleChangeStatus([row.id]).then(() => {
                message.success("标记已读成功");
                setLoading(false);
                getUnconfirmedMessageCount();
              });
            }}
          >
            {getIsReadText(row.confirmStatus)}
          </div>
        ) : (
          <div className="MessageTableRow_title-changeStatus-readed">已读</div>
        )}
      </div>
      <div className="MessageTableRow_content">
        <div className="MessageTableRow_content-title">
          {rowModal.RowCardContent.title}
        </div>
        <div className="MessageTableRow_content-content">
          <div className="wrapper">
            <input id={`exp${id}`} className="exp" type="checkbox" />
            <div className="text">
              <label className="btn" htmlFor={`exp${id}`}></label>
              <span
                dangerouslySetInnerHTML={{
                  __html: rowModal.RowCardContent.content,
                }}
              ></span>
            </div>
          </div>
          {/* <ClampLines text={rowModal.RowCardContent.content} id="default" lines={1} moreText={'>>>'} lessText={'<<<'}/> */}
        </div>
        <div className="MessageTableRow_content-enqueueTime">
          <span>创建时间：</span>
          <span>{rowModal.enqueueTime}</span>
        </div>
        <div className="MessageTableRow_content-username">
          <span>创建人：</span>
          <span>{rowModal.username}</span>
        </div>
        {
          rowModal.RowCardContent.links?.length &&
          <div className='MessageTableRow_content-links'>
            {renderBtns(rowModal.RowCardContent.links)}
          </div>
        }
      </div>
    </div>
  );
};

interface IMessageTableRowProps {
  row: IRow;
  getUnconfirmedMessageCount: any;
}

interface IRow {
  id: string;
  sender: {
    projectCode: string;
    username: string;
  };

  confirmStatus: confirmStatusType;
  enqueueTime: string;
  content: string;
}

interface IRowCardContent {
  title: string;
  content: string;
  link?: {
    type: string;
    url: string;
  };
  links?: IMsgLink[]
}
