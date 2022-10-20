---
title: columnActions
subtitle: 表格列动作
category: utils
order: 1
---

该工具方法主要在表格中使用，目前仅包含一个。

## API

### 链接跳转，columnActions.go()

主要配合 `columnRenders.operate` 使用。

`${表达式}`，使用 `lodash template` 方法进行解析，可用变量包含当前行的数据。如：`${name}`。

跳转使用 `window.location.hash` 方式。

```ts
columnActions.go("/view?id=${id}");
```

<!-- ud-demo("基本用法", "调用后会返回一个页面对象", "demos/basic.tsx") -->
