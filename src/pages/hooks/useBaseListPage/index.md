---
title: useBaseListPage
subtitle: 基础列表页
category: hooks
order: 0
---

BaseListPage 的 Hooks 版本，API 有一些差异，总体上更加简洁易用。

## 基本用法

```ts
const Demo: React.FC = () => {
  const page = useBaseListPage({
    // 配置参数
  });
  return page.render();
};
```

调用 `useBaseListPage` 后，会返回一个 page 对象，该对象中有 `render`、`states`、`actions`、`lifecycles` 和 `refs`，具体内容可参考下方的 API 说明。

## API

### 配置参数

<!-- ud-ts("index.tsx", "IUseBaseListPageProps") -->

### Page 对象

- `render`：页面渲染方法，需要在组件末尾调用此方法。
- `states`：暴露的状态

  - selectedRowKeys：表格选中行的 key 集合
  - selectedRows：表格选中行的集合
  - dataSource：表格绑定的数据源
  - querying：当前查询状态
  - queryParams：当前查询参数
  - pagination：当前分页信息

- `actions`：暴露的方法

  - query：发起查询
  - getQueryParams：获取查询参数
  - changeParams：改变查询参数并发起查询

- `lifecycles`：暴露的生命周期

  - getQueryParamsAfter：获取查询参数后，可用于记录、修改查询参数。
  - queryBefore：查询接口前，可用于阻止查询、日志记录等。
  - handleDataSourceAfter：处理后端返回的数据后，可在这里再次加工数据等。

- `refs`：暴露的 ref

  - filterForm：检索条件表单实例

## 例子

> 下面例子调用的接口均为 mock 数据。

---

<!-- ud-demo("简洁写法", "最简洁的写法，只适合简单的情况", "demos/concise.tsx") -->

<!-- ud-demo("标准写法", "调用后会返回一个页面对象", "demos/basic.tsx") -->

<!-- ud-demo("生命周期", "展示生命周期的基本用法", "demos/lifecycles.tsx") -->

<!-- ud-demo("插槽", "Render 预留的 Slots 用于扩展页面", "demos/slots.tsx") -->

<!-- ud-demo("使用深度分页分页", "使用深度分页器的基础列表页，只展示上一页下一页", "demos/sequencePager.tsx") -->
