---
title: UdAjaxSelect
subtitle: Ajax下拉框
category: formControl
order: 6
---

UdAjaxSelect，基于 `Antd Select` 。通过调用接口绑定数据。

## API

> 支持通过 `UdAjaxSelect.defaultProps` 配置 `默认 props`。

> 支持通过 `UdAjaxSelect.defaultMappingSchemes` 配置 `默认映射方案`。

<!-- ud-ts("index.tsx", "UdAjaxSelectProps") -->

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->

<!-- ud-demo("结合表单", "结合表单使用", "demos/form.tsx") -->

<!-- ud-demo("自定义数据绑定", "当后端返回的结构不是标准结构时，可通过 mapping 实现自定义数据绑定", "demos/mapping.tsx") -->

<!-- ud-demo("query 支持 Promise", "当获取下拉数据请求比较特殊时可在 query 属性传入一个 Promise 发起合适的请求来获取下拉数据", "demos/query.tsx") -->

<!-- ud-demo("联动用法", "进入页面通过queryAfterMount设置是否获取数据，通过params不同重新获取数据", "demos/linkage.tsx") -->
