---
title: UdFormList
subtitle: 可增减的动态嵌套表单控件
category: formControl
order: 7
---

UdFormList，基于 Antd Form.List 组件封装。

> 此控件不支持脱离表单控件单独使用。

## API

> 支持通过 `UdFormList.defaultProps` 配置 `默认 props`。

### UdFormList

<!-- ud-ts("index.tsx", "IUdFormListProps") -->

### IUdFormListItem

<!-- ud-ts("index.tsx", "IUdFormListItem") -->

## 例子

<!-- ud-demo("基本使用", "简单的使用", "demos/form.tsx") -->

<!-- ud-demo("内部联动", "根据所选控件的值，控制其余的列渲染不同的控件，并且在切换时，清除需要重渲染的控件的值", "demos/linkage.tsx") -->
