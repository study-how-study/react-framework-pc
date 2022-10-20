import { LastDataIdQueue } from "../utils";

const initState = {
  dataSource: [],
  searchParams: {
    confirmStatus: "UNCONFIRMED",
  },
  advanceSearchParams: {},
  totalDataSource: [],
  advanceSearchModal: {},
  pagination: {
    pageSize: 10,
    current: 1,
    hasNext: true,
  },
  loading: false,
  webMsgServiceOption: {},
  msgModel: {},
  projectCodes: [],
  isSimpleSearch: true,
  isAdvancedSearch: false,
  simpleReadStatus: "UNCONFIRMED",
  lastDataId: "",
  dataId: '',
  lastDataIdQueue: new LastDataIdQueue([""]),
};

const modalMessageCardReducer = (state = initState, action) => {
  switch (action.type) {
    case "REPLACE_DATASOURCE":
      return {
        ...state,
        dataSource: action.payload.dataSource ? action.payload.dataSource : [],
      };
    case "REPLACE_SEARCH_PARAMS":
      return {
        ...state,
        searchParams: action.payload.searchParams,
      };
    case "REPLACE_ADVANCE_SEARCH_PARAMS":
      return {
        ...state,
        advanceSearchParams: action.payload.advanceSearchParams,
      };
    case "UPDATE_SEARCH_PARAMS":
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          ...action.payload.searchParams,
        },
      };

    case "REPLACE_SEARCH_PARAMS_CONFIRM_STATUS":
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          confirmStatusSimple: action.payload.confirmStatus,
        },
      };
    case "CHANGE_ROW_CONFIRM_STATUS_BY_ID":
      const id = action.payload.id;
      return {
        ...state,
        dataSource: state.dataSource.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              confirmStatus: "CONFIRMED",
            };
          }
          return item;
        }),
      };
    case "CHANGE_ALL_ROW_CONFIRM_STATUS":
      return {
        ...state,
        dataSource: state.dataSource.map((item) => {
          return {
            ...item,
            confirmStatus: "CONFIRMED",
          };
        }),
      };
    case "REPLACE_TOTAL_DATASOURCE":
      return {
        ...state,
        totalDataSource: action.payload.totalDataSource
          ? action.payload.totalDataSource
          : [],
      };
    case "REPLACE_TOTAL_DATASOURCE_ROW_STATUS_BY_ID":
      const totalId = action.payload.id;

      return {
        ...state,
        totalDataSource: state.totalDataSource.map((item) => {
          if (item.id === totalId) {
            return {
              ...item,
              confirmStatus: "CONFIRMED",
            };
          }
          return item;
        }),
      };
    case "REPLACE_ALL_TOTAL_DATASOURCE_ROW_STATUS":
      return {
        ...state,
        totalDataSource: state.totalDataSource.map((item) => {
          return {
            ...item,
            confirmStatus: "CONFIRMED",
          };
        }),
      };
    case "SET_ADVANCE_SEARCH_MODAL":
      return {
        ...state,
        advanceSearchModal: action.payload.advanceSearchModal,
      };
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload.loading,
      };
    case "SET_ADVANCED_SEARCH":
      return {
        ...state,
        simpleSearch: false,
        advancedSearch: true,
      };
    case "SET_SIMPLE_SEARCH":
      return {
        ...state,
        simpleSearch: true,
        advancedSearch: false,
      };
    case "SET_SIMPLE_STATUS":
      return {
        ...state,
        simpleReadStatus: action.payload.simpleReadStatus,
      };
    // case "SET_LAST_MESSAGE_ID":
    //   return {
    //     ...state,
    //     latestMessageId: action.payload.latestMessageId,
    //   };
    // case "SET_MESSAGE_ID_FROM":
    //   return {
    //     ...state,
    //     messageIdFrom: action.payload.messageIdFrom,
    //   };
    case "SET_DATA_ID":
      return {
        ...state,
        dataId: action.payload.dataId,
      };
    case "SET_LAST_DATA_ID":
      return {
        ...state,
        lastDataId: action.payload.lastDataId,
      };
    case "ENQUEUE_LAST_DATA_ID":
      return {
        ...state,
        lastDataIdQueue: state.lastDataIdQueue.enqueue(action.payload.dataId),
      };
    case "DEQUEUE_LAST_DATA_ID":
      return {
        ...state,
        lastDataIdQueue: state.lastDataIdQueue.dequeue(),
      };
    default:
      return state;
  }
};

export { modalMessageCardReducer };
