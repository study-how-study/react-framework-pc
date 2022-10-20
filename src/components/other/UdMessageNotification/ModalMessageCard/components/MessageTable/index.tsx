import { Spin } from "antd";
import _ from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ModalMessageCardContext } from "../..";
import { BASE_TAG_AND_TOPIC } from "../../constants";
import { getMessage } from "../../requests";
import { shouldHaveNext } from "../../utils";
import MessageTablePagination from "./components/MessageTablePagination";
import { MessageTableRow } from "./components/MessageTableRow";

export const MessageTable = (props: any) => {
  const { getUnconfirmedMessageCount } = props;
  const [state, dispatch] = useContext(ModalMessageCardContext);
  const { ModalMessageCard } = state;

  const { dataSource, totalDataSource, searchParams, pagination, lastDataId, loading, lastDataIdQueue } =
    ModalMessageCard;
  const { hasNext, current, pageSize } = pagination;


 

  const setHasNext = (hasNext) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        pagination: {
          hasNext,
        },
      },
    });
  };

  const setLoading = (loading) => {
    dispatch({
      type: "SET_LOADING",
      payload: {
        loading
      },
    });
  }

  const setLastDataId = (lastDataId) => {
    dispatch({
      type: "SET_LAST_DATA_ID",
      payload: {
        lastDataId
      },
    });
  }

  const setDataId = (dataId) => {
    dispatch({
      type: "SET_DATA_ID",
      payload: {
        dataId
      },
    });
  }

  const setCurrent = (current) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        pagination: {
          current,
        },
      },
    });
  };

  const setPageSize = (pageSize) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        pagination: {
          pageSize,
        },
      },
    });
  };

  const setLastDataIdQueue = (lastDataId, {isPrev = false, isPageSizeChange = false}) => {

    if(isPageSizeChange) {
      lastDataIdQueue.init()
      lastDataIdQueue.print()
      return false;
    }

    if (isPrev) {
      lastDataIdQueue.pop()
      lastDataIdQueue.print()
      return false;
    }

    lastDataIdQueue.enqueue(lastDataId)
    lastDataIdQueue.print()
   

  }

  const init = useCallback(() => {
    setCurrent(1);
    setPageSize(10);
    lastDataIdQueue.init()
    getMessage({
      confirmStatus: 'UNCONFIRMED'
    }, state.ModalMessageCard).then((res) => {
      const { data } = res;
      const { lastDataId, content, hasNext } = data;

      setLoading(false);
      setHasNext(hasNext);
      dispatch({
        type: "REPLACE_DATASOURCE",
        payload: { dataSource: content },
      });
      dispatch({
        type: "REPLACE_TOTAL_DATASOURCE",
        payload: { totalDataSource: content },
      });
      setLastDataId(lastDataId);
    });
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  // const shouldHaveNextCb = useCallback(() => {
  //   const haveNext = shouldHaveNext(dataSource, pageSize, latestMessageId);
  //   setHasNext(haveNext);
  // }, [dataSource]);

  // useEffect(() => {
  //   shouldHaveNextCb();
  // }, [shouldHaveNextCb]);

  const handleParamsChange = (page) => {
    const params = {
      ...searchParams,
      ...page,
    };
    
    getMessage(params, state.ModalMessageCard).then((res) => {
      const { data } = res;
      const { lastDataId, content } = data;
      dispatch({
        type: "SET_LOADING",
        payload: { loading: false },
      });
      dispatch({
        type: "REPLACE_DATASOURCE",
        payload: { dataSource: content },
      });
      dispatch({
        type: "REPLACE_TOTAL_DATASOURCE",
        payload: { totalDataSource: totalDataSource.concat(content) },
      });

      dispatch({
        type: "SET_PAGINATION",
        payload: {
          pagination: {
            hasNext: shouldHaveNext(data),
          },
        },
      });

      setLastDataId(lastDataId);
    });
  };

  const MessageTableContent = dataSource.map((item) => (
    <MessageTableRow
      row={item}
      key={item.id}
      getUnconfirmedMessageCount={getUnconfirmedMessageCount}
    />
  ));

  const EmptyContent = (
    <div className="EmptyContent">
      <span>暂无数据</span>
    </div>
  );

  return (
    <div>
      <div className={`ud-ModalMessageCard-Table ${loading ? 'loading' : ''}`}>
        {loading ? <Spin spinning={loading} /> : (!_.isEmpty(dataSource) ? MessageTableContent : EmptyContent)}
        {/* {} */}
      </div>
      <MessageTablePagination
        current={current}
        pageSize={pageSize}
        hasNext={hasNext}
        onChange={(iCurrent, pageSize, isPrev) => {
          setCurrent(iCurrent);
          dispatch({
            type: "SET_LOADING",
            payload: { loading: true },
          });

          if (isPrev) {
            let start = pageSize * -2;
            let end = -pageSize;
            let offset = totalDataSource.length % 10;
            if (offset !== 0) {
              start = pageSize * -1 - offset;
              end = -offset;
            }

            const data = totalDataSource.slice(start, end);
            dispatch({
              type: "REPLACE_DATASOURCE",
              payload: { dataSource: data },
            });
            let sectionOffset = totalDataSource.length - pageSize;
            if (offset !== 0) {
              sectionOffset = totalDataSource.length - offset;
            }
            const sectionData = totalDataSource.slice(0, sectionOffset);
            dispatch({
              type: "REPLACE_TOTAL_DATASOURCE",
              payload: { totalDataSource: sectionData },
            });
            if (sectionData[sectionData.length - 1]) {
              setLastDataId(sectionData[sectionData.length - 1].id);
            }
            setHasNext(true);
            dispatch({
              type: "SET_LOADING",
              payload: { loading: false },
            });
            setLastDataIdQueue(lastDataId, {
              isPrev: true,
            })
            return false;
          }

          let p: any = {
            size: pageSize,
          };

          if (lastDataId) {
            p.dataId = lastDataId;
          }
          setDataId(lastDataId)

          setLastDataIdQueue(lastDataId, {})

          handleParamsChange(p);
        }}
        handlePageSizeOption={(size) => {
          let p: any = {
            size,
            dataId: "",
          };
          setCurrent(1);
          setPageSize(size);
          setLastDataId("");
          setDataId("")
          setLastDataIdQueue(lastDataId, {isPageSizeChange: true});
          handleParamsChange(p);
        }}
      />
    </div>
  );
};
