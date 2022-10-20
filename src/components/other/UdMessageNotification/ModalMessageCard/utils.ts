import _ from "lodash";
import { PROJECT_CODES } from "./constants";

export const isRead = (status) => {
  return status === "CONFIRMED";
};

export const getIsReadText = (status) => {
  if (!isRead(status)) {
    return "标记为已读";
  }
  return false;
};

export const getProjectName = (projectCode) => {
  const item = PROJECT_CODES.find((cItem) => cItem.customId === projectCode);
  if (item) {
    return item.text;
  }
  return "";
};

// export const shouldHaveNext = (dataSource, pageSize, latestMessageId) => {
//     // debugger

//     const isEmptyContent = (dataSource && dataSource.length === 0) || !dataSource
//     const isLessThanPageSize = _.isArray(dataSource) && dataSource.length < pageSize
//     const isEqualThanPageSize = _.isArray(dataSource) && dataSource.length === pageSize
//     // const isLastQuery = _.isArray(dataSource) && !_.isEmpty(dataSource[dataSource.length - 1]) && dataSource[dataSource.length - 1].id === latestMessageId
//     debugger
//     if (isEmptyContent || isLessThanPageSize) {
//         return false
//     }
//     if (latestMessageId && isEqualThanPageSize) {
//         return true;
//     }

//     return true;
// }

export const shouldHaveNext = (data) => {
  if (!data) {
    return false;
  }
  return data.hasNext;
};

export const getEmptyValues = (isAdvanced) => {
  const emptyValues = {
    confirmStatus: undefined,
    projectCode: undefined,
    keyword: undefined,
    "sendTimeStart|sendTimeEnd": undefined,
    dataId: "",
  };

  return emptyValues;
};

export class LastDataIdQueue {
  items: string[];
  constructor(initialValue = []) {
    this.items = initialValue;
  }

  enqueue(element: string) {
    this.items.push(element);
    return this
  }

  init() {
    this.items = [""];
    this.print()
  }

  pop() {
    this.items.pop()
  }

  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this
  }

  isEmpty() {
    return this.items.length === 0;
  }

  length() {
    return this.items.length
  }

  front() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[0];
  }

  fromArray() {
    return this.items
  }


  print() {
    console.log(this.items)
  }
}
