---
title: useBaseDetailPage
subtitle: 基础详情页
category: hooks
order: 1
---

BaseDetailPage 的 Hooks 版本，API 有一些差异，总体上更加简洁易用。

## 基本用法

```ts
const Demo: React.FC = () => {
  const page = useBaseDetailPage({
    // 配置参数
  });
  return page.render();
};
```

调用 `useBaseDetailPage` 后，会返回一个 page 对象，该对象中有 `render`、`states`、`actions` 和 `lifecycles`，具体内容可参考下方的 API 说明。

## API

### 配置参数

<!-- ud-ts("index.tsx", "IUseBaseDetailPageConfig") -->

### Page 对象

- `render`：页面渲染方法，需要在组件末尾调用此方法。
- `states`：暴露的状态

  - dataSource：详情数据源
  - querying：当前查询状态

- `actions`：暴露的方法

  - query：发起查询
  - getQueryParams：获取查询参数

- `lifecycles`：暴露的生命周期

  - handleDataSourceAfter：处理后端返回的数据后，可在这里再次加工数据等。

## 例子

> 下面例子调用的接口均为 mock 数据。

> 下面例子中都使用了 useHeaderAffix、useFooterAffix 参数，仅为了示例效果设置，请根据实际情况选择是否使用这些参数。

---

<!-- ud-demo("标准用法", "调用后会返回一个页面对象", "demos/basic.tsx") -->

<!-- ud-demo("params 参数", "自定义查询条件参数", "demos/params.tsx") -->

<!-- ud-demo("插槽", "通过插槽覆盖默认的展示方式", "demos/slots.tsx") -->
