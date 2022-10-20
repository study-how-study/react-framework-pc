import { Button, message, Select } from "antd";
import _ from "lodash";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalMessageCardContext } from "../..";
import { UdDateRangePicker, UdFilter, UdModal } from "../../../../..";
import { DEFAULT_PAGINATION, PROJECT_CODES } from "../../constants";
import { confirmMessageAll, getMessage } from "../../requests";
import { getEmptyValues, shouldHaveNext } from "../../utils";
const Option = Select.Option;

export const Toolbar = (props: { getUnconfirmedMessageCount: any }) => {
  const [state, dispatch] = useContext(ModalMessageCardContext);
  const [isSearch, setIsSearch] = useState(false);
  const [simpleSearchStatus, setSimpleSearchStatus] = useState('UNCONFIRMED');

  const [udFilterItems, setUdFilterItems] = useState(() => {
    const res = [];

    const projectItem = [
      {
        label: "分类",
        name: "projectCode",
        render: () => {
          return (
            <Select>
              {state.ModalMessageCard.projectCodes.map((item) => (
                <Option value={item.customId} label={item.text}>
                  {item.text}
                </Option>
              ))}
            </Select>
          );
        },
      },
    ];
    const initItem = [
      {
        label: "状态",
        name: "confirmStatus",
        render: () => {
          return (
            <Select placeholder="请选择消息状态" allowClear>
              <Option value="CONFIRMED" label="已读">
                已读
              </Option>
              <Option value="UNCONFIRMED" label="未读">
                未读
              </Option>
            </Select>
          );
        },
      },
      { label: "消息内容", name: "keyword" },
      {
        label: "消息日期",
        name: "sendTimeStart|sendTimeEnd",
        children: <UdDateRangePicker format="YYYY-MM-DD" timeFill/>,
      },
    ];
    const left = initItem.slice(0, 1);
    const right = initItem.slice(1);
    if (!_.isEmpty(state.ModalMessageCard.projectCodes)) {
      return res.concat(left).concat(projectItem).concat(right);
    }

    return initItem;
  });

  const setLastDataId = (lastDataId) => {
    dispatch({
      type: "SET_LAST_DATA_ID",
      payload: {
        lastDataId
      },
    });
  }

  const handleSearch = () => {
    state.ModalMessageCard.lastDataIdQueue.init();
    dispatch({
      type: "SET_SIMPLE_SEARCH",
    });
    getMessage(
      {
        confirmStatus: simpleSearchStatus,
      },
      state.ModalMessageCard
    ).then((res) => {
      const { data } = res;
      const { lastDataId, content } = data;
      dispatch({
        type: "REPLACE_DATASOURCE",
        payload: { dataSource: content },
      });
      dispatch({
        type: "REPLACE_SEARCH_PARAMS",
        payload: {
          searchParams: {
            confirmStatus: simpleSearchStatus,
          },
        },
      });
      dispatch({
        type: "REPLACE_TOTAL_DATASOURCE",
        payload: { totalDataSource: content },
      });
      dispatch({
        type: "SET_PAGINATION",
        payload: {
          pagination: {
            ...DEFAULT_PAGINATION,
            hasNext: shouldHaveNext(data),
          },
        },
      });
      setLastDataId(lastDataId);
     
    });
  };

  const setParams = (formatValues) => {
    dispatch({
      type: "REPLACE_SEARCH_PARAMS",
      payload: { searchParams: formatValues },
    });
    dispatch({
      type: "REPLACE_ADVANCE_SEARCH_PARAMS",
      payload: { advanceSearchParams: formatValues },
    });
  };

  const getMessageByParams = (params, modal, isSearchTrigger) => {
    // if (!params.confirmStatus) {
    //   params.confirmStatus = simpleSearchStatus;
    // }

    getMessage(params, state.ModalMessageCard).then((res) => {
      const { data } = res;
      const { lastDataId, content } = data;
      dispatch({
        type: "SET_PAGINATION",
        payload: {
          pagination: {
            ...DEFAULT_PAGINATION,
            hasNext: shouldHaveNext(data),
          },
        },
      });

      dispatch({
        type: "REPLACE_SEARCH_PARAMS",
        payload: {
          searchParams: {
            ...params,
          },
        },
      });
      dispatch({
        type: "REPLACE_TOTAL_DATASOURCE",
        payload: { totalDataSource: content },
      });
      dispatch({
        type: "REPLACE_DATASOURCE",
        payload: { dataSource: content },
      });
      setLastDataId(lastDataId);

      if (isSearchTrigger) {
        setIsSearch(true);
      }
      modal.destroy();
    });
  };
  const handleAdvanceSearch = (values, modal) => {

    state.ModalMessageCard.lastDataIdQueue.init();
    dispatch({
      type: "SET_ADVANCED_SEARCH",
    });
    const formatValues = {
      ...values,
      ...(values.sendTimeStart && {
        sendTimeStart: moment(values.sendTimeStart).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        sendTimeEnd: moment(values.sendTimeEnd).format("YYYY-MM-DD HH:mm:ss"),
      }),
    };
  
    setParams(formatValues);
    getMessageByParams(formatValues, modal, true);
  };

  const handleConfirmSelect = (value) => {
    setSimpleSearchStatus(value);
   
  };

  useEffect(() => {
    const emptyValues = getEmptyValues(false);
    dispatch({
      type: "REPLACE_SEARCH_PARAMS",
      payload: {
        searchParams: {
          ...emptyValues,
          confirmStatus: "UNCONFIRMED",
        },
      },
    });
  }, []);

  const handleAdvancedSearchModalOpen = () => {
    const initialValues = {
      ...state.ModalMessageCard.advanceSearchParams,
      ...(state.ModalMessageCard.advanceSearchParams.sendTimeStart && {
        "sendTimeStart|sendTimeEnd": [
          moment(state.ModalMessageCard.advanceSearchParams.sendTimeStart),
          moment(state.ModalMessageCard.advanceSearchParams.sendTimeEnd),
        ],
      }),
    };

    if (initialValues.confirmStatus === "ALL") {
      initialValues.confirmStatus = undefined;
    }

    const modal = UdModal.open({
      title: "系统消息",
      width: "1000px",
      className: "ud-ModalMessageCard-top-advanced",
      content: (
        <>
          <UdFilter
            initialValues={initialValues}
            items={udFilterItems}
            onSearch={(values) => handleAdvanceSearch(values, modal)}
            onReset={(form) => {
              const emptyValues = getEmptyValues(true);
              form.setFieldsValue(emptyValues);
              dispatch({
                type: "UPDATE_SEARCH_PARAMS",
                payload: {
                  searchParams: emptyValues,
                },
              });
            }}
          />
          <div className="ud-ModalMessageCard-top-advanced-cancel">
            <Button
              onClick={() => {
                handleOnCancel(modal);
                modal.destroy();
              }}
            >
              取消
            </Button>
          </div>
        </>
      ),
      onCancel: () => {
        handleOnCancel(modal);
      },
      footer: null,
    });
  };

  // const handleOnCancel = (modal) => {
  //   if (isSearch) {
  //     handleSearch();
  //     setIsSearch(false);
  //   }
  // };

  const handleOnCancel = (modal) => {
    if (isSearch) {
      setParams({});
      getMessageByParams({
        confirmStatus: simpleSearchStatus
      }, modal, false);
      setIsSearch(false);
      state.ModalMessageCard.lastDataIdQueue.init();
    }
  };
  const setLoading = (loading) => {
    dispatch({
      type: "SET_LOADING",
      payload: {
        loading,
      },
    });
  };
  const handleConfirmAll = () => {
    setLoading(true);
    confirmMessageAll(state.ModalMessageCard).then((res) => {
      if (res.data) {
        if(_.isFunction(state.ModalMessageCard.onReadAll)) {
          state.ModalMessageCard.onReadAll()
        }

        setLoading(false);
        message.success("操作成功");

        const {
          searchParams,
          totalDataSource,
          dataSource,
          pagination,
          lastDataIdQueue,
        } = state.ModalMessageCard;
        let params = {
          ...searchParams,
          dataId: '',
        };
        
        getMessage(params, state.ModalMessageCard).then((res) => {
          const { data } = res;
          const { lastDataId, content } = data;

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
      
          dispatch({
            type: "REPLACE_TOTAL_DATASOURCE",
            payload: { totalDataSource: content },
          });

          dispatch({
            type: "SET_PAGINATION",
            payload: {
              pagination: {
                current: 1,
                hasPrevious: false,
                hasNext: shouldHaveNext(data),
              },
            },
          });
        });
        props.getUnconfirmedMessageCount();
      }
    });
  };

  return (
    <div className="ud-ModalMessageCard-top">
      <Button onClick={handleConfirmAll}>全部标记为已读</Button>
      <div>
        <StatusSelect
          className={"ud-ModalMessageCard-top_select"}
          onSelect={handleConfirmSelect}
          setSimpleSearchStatus={setSimpleSearchStatus}
          simpleSearchStatus={simpleSearchStatus}
        />
        <Button type="primary" onClick={handleSearch}>
          搜索
        </Button>
        <Button onClick={() => handleAdvancedSearchModalOpen()}>
          高级搜索
        </Button>
      </div>
    </div>
  );
};

const StatusSelect = (props) => {
  const { className, onSelect, simpleSearchStatus, setSimpleSearchStatus } = props;


  return (
    <Select
      className={className}
      placeholder="请选择消息状态"
      onSelect={onSelect}
      value={simpleSearchStatus}
      onClear={() => {
        setSimpleSearchStatus(undefined);
      }}
      allowClear
    >
      <Option value="CONFIRMED" label="已读">
        已读
      </Option>
      <Option value="UNCONFIRMED" label="未读">
        未读
      </Option>
    </Select>
  );
};
