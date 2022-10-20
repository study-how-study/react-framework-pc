// urls
export const GET_MESSAGE_URL = "/manage/v1/clients/getMessage";
export const CONFIRM_MESSAGE_URL = "/manage/v1/msg/confirm";
export const CONFIRM_ALL_MESSAGES_URL = "/manage/v1/msg/confirmAll";

//constants
export const BASE_TAG_AND_TOPIC = {
  topic: "UAA-USER-MSG"
};

export const DEFAULT_PAGINATION = {
  pageSize: 10,
  current: 1,
  hasNext: true,
};

export const PROJECT_CODES = [
  {
    application: "EOMS",
    type: "GROUP",
    text: "运维系统",
    customId: "EOMS",
    icon: "tool",
    orderIndex: 0,
    link: "https://eoms-test.1919.cn/manage/v1/eoms",
    url: "https://web-test.1919.cn/eoms/index.html",
    webUrl: null,
  },
  {
    application: "TBS-INFRA",
    type: "GROUP",
    text: "技术基础服务",
    customId: "TBS-INFRA",
    icon: "codepen-circle",
    orderIndex: 0,
    link: "https://cp-tbs-test.1919.cn",
    url: "https://web-test.1919.cn/tbs-infra/index.html",
    webUrl: null,
  },
  {
    application: "BIZ-INFRA-MANAGE-OPENAPI",
    type: "GROUP",
    text: "业务基础服务",
    customId: "BIZ-INFRA-MANAGE-OPENAPI",
    icon: "appstore",
    orderIndex: 0,
    link: "https://test-push.1919.cn",
    url: "https://web-test.1919.cn/biz-infra-manage-openapi/index.html",
    webUrl: null,
  },
  {
    application: "uaa",
    type: "GROUP",
    text: "用户认证中心",
    customId: "uaa",
    icon: "unlock",
    orderIndex: 0,
    link: "https://uaa-gateway-test.1919.cn",
    url: "https://web-test.1919.cn",
    webUrl: null,
  },
  {
    application: "howfun",
    type: "GROUP",
    text: "好耍项目",
    customId: "howfun",
    icon: "reddit",
    orderIndex: 0,
    link: "https://howfun-test.1919.cn",
    url: "https://web-test.1919.cn/howfun-admin/index.html",
    webUrl: null,
  },
  {
    application: "1919-kuaihe",
    type: "GROUP",
    text: "1919吃喝",
    customId: "1919-kuaihe",
    icon: "unlock",
    orderIndex: 0,
    link: "https://ch-app-gateway-test.1919.cn",
    url: "https://web-test.1919.cn/1919-kuaihe/index.html",
    webUrl: null,
  },
  {
    application: "PRICE-CENTER",
    type: "GROUP",
    text: "价格中心",
    customId: "PRICE-CENTER",
    icon: "deployment-unit",
    orderIndex: 0,
    link: "https://price-center-test.1919.cn",
    url: "https://web-test.1919.cn/price-center/index.html",
    webUrl: null,
  },
  {
    application: "UPC",
    type: "GROUP",
    text: "商品中心",
    customId: "UPC",
    icon: "sketch",
    orderIndex: 0,
    link: "https://upc-manage-test.1919.cn/manage/api",
    url: "https://web-test.1919.cn/upc/index.html",
    webUrl: null,
  },
  {
    application: "flow-center",
    type: "GROUP",
    text: "流程中心",
    customId: "flow-center",
    icon: "branches",
    orderIndex: 0,
    link: "https://flow-center-test.1919.cn",
    url: "https://web-test.1919.cn/flow-center/index.html",
    webUrl: null,
  },
];
