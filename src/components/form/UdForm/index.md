---
title: UdForm
subtitle: 表单
category: form
order: 2
---

UdForm，基于 Antd Form。提供了更多的新功能，同时优化了写法让代码更加简单易于维护。

扩展内容：

1. `children` 和 `render` 不传的话，默认为 `<Input />`
2. name 支持多字段，多个字段之间用 `|` 隔开
3. 字段的值为空时，表单默认不会返回该字段，可使用 `keepEmptyValueItem` 属性进行控制
4. string 类型的字段的值去除前后空格，可使用 `valueUseTrim` 属性进行控制
5. 增加 `grid` 布局方式

## API

### Props

<!-- ud-ts("index.tsx", "IUdFormProps") -->

### UdFormLayout

```ts
type UdFormLayout = "horizontal" | "inline" | "vertical" | "grid";
```

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->

<!-- ud-demo("布局方式", "新增Grid布局方式", "demos/layout.tsx") -->

<!-- ud-demo("显示联动", "表单项之间的显示联动", "demos/show-coordinated.tsx") -->

<!-- ud-demo("插槽", "内置的几个插槽，可用于自定义显示一些东西", "demos/slots.tsx") -->
