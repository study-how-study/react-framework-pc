---
title: UdTable
subtitle: 表格
category: dataViewer
order: 1
---

UdTable， Antd Table。

#### 扩展内容：

- 表格编辑功能
- 表格列自定义
- 表格数据导出
- 表格列自适应宽度

#### 编辑表格：

- 以 `ud` 开头的字段，为组件内部使用，请勿轻易在外面使用。
- 可编辑的单元格所使用的控件，需要符合 antd 表单控件规范。
- 通过 ref 获取表单实例对象，对象内有各种实用方法，具体请看下面的 API 表格。

## API

### Props

<!-- ud-ts("typings.ts", "IUdTableProps") -->

### IUdColumn

> minWidth、maxWidth、fixedWidth 是不包含 padding 的。

<!-- ud-ts("typings.ts", "IUdColumn") -->

### UdTableInstance

表单实例，请忽略下列表格中的 必传 列

<!-- ud-ts("typings.ts", "UdTableInstance") -->

## 例子

<!-- ud-demo("分页保留选中行", "分页保留选中行", "demos/keepSelectedRows.tsx") -->
<!-- ud-demo("可编辑表格", "校验规则根据数据行生成", "demos/basic-edit.tsx") -->
