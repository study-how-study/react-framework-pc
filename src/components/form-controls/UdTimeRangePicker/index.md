---
title: UdTimeRangePicker
subtitle: 时间范围选择框
category: formControl
order: 5
---

UdTimeRangePicker，基于 Antd TimeRangePicker

扩展内容：

- `value` 和 `defaultValue` 类型从 `Moment[]` 改成 `string[]` 类型。
- `value` 和 `defaultValue` 的值如果与默认的 `format` 、传入的 `format` 格式或其他的值会被认定为不合法将认定为 `null` 值。
- `onChange` 回调的 `value` 类型统一为 `string[] | undefined`，格式由 `format` 字段决定，默认为 `HH:mm`

## API

> 支持通过 `UdTimeRangePicker.defaultProps` 配置 `默认 props`。

<!-- ud-ts("index.tsx", "IUdTimeRangePickerProps") -->

## 例子

<!-- ud-demo("最基本的用法", "受控组件,设置format改变时间格式", "demos/basic.tsx") -->

<!-- ud-demo("非受控", "非受控单独使用时", "demos/uncontrolled.tsx") -->

<!-- ud-demo("结合表单", "结合表单使用", "demos/form.tsx") -->
