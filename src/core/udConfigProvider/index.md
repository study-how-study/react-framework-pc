---
title: config
subtitle: 配置
category: config
order: 1
---

主要通过 `udConfigProvider` 和 各组件自身的 `defaultProps` 进行配置。

## 组件配置

大部分可配置的组件，可通过 `defaultProps` 、 `defaultStates` 或 `defaultConfig` 进行配置。

具体请参考组件的相关文档。

例如：

```ts
import {
  UdTable,
  UdDetail,
  useBaseListPage,
  BaseListPage,
} from "@ud/admin-framework";

UdTable.defaultProps.useToolbarAffix = false;
UdDetail.defaultProps.nullText = "暂无";
useBaseListPage.defaultConfig.useColumnCustomize = false;
BaseListPage.defaultStates.useExport = false;
```

## udConfigProvider

`udConfigProvider` 主要用于配置一些非组件的其他配置。

> 以下文档未写各配置的默认值，可查看源代码获知。

### http

包含 http ajax 请求相关的配置。

- useRpcWrap：是否使用 rpc-wrap 。
- useBizErrorHandler：是否使用业务错误处理器
- useSysErrorHandler：是否使用系统错误处理器
- errorTip：错误提示方法
- requestBeforeSetToken：请求发送前设置 Token
- requestBefore：请求发送前
- errorHandler：错误处理器，可根据错误码新增处理方法。
  - request：发送请求失败
  - 400：请求参数有误
  - 401：未登陆
  - 403：权限不足
  - 404：请求资源不存在
  - 500：系统内部错误
  - other：其他错误

### auth

权限相关配置。

- canUse：判断是否有权限

### api

接口相关配置。

- useConditionsField：列表页查询时是否使用 conditions 字段。

### ui

界面相关配置。

- getPageContainer：子页面容器。
- table.watermark：水印相关配置。
