---
title: UdDatePicker
subtitle: 日期选择器
category: formControl
order: 2
---

UdDatePicker，基于 Antd DatePicker。

扩展内容：

- `value` 和 `defaultValue` 类型从 `Moment` 改成 `string` 类型。
- `value` 和 `defaultValue` 的值如果是 `0000-00-00`、`0000/00/00` 和 `0000-00-00 00:00:00` 等类似不合法的值都将认定为 `null` 值。
- `onChange` 回调的 `value` 类型统一为 `string | undefined`，格式由 `format` 或 `showTimeFormat` 字段决定，默认为 `YYYY-MM-DD` 和 `YYYY-MM-DD HH:mm:ss`

## API

> 支持通过 `UdDatePicker.defaultProps` 配置 `默认 props`。

<!-- ud-ts("index.tsx", "IUdDatePickerProps") -->

## 例子

<!-- ud-demo("受控", "受控单独使用时", "demos/basic.tsx") -->

<!-- ud-demo("非受控", "非受控单独使用时", "demos/uncontrolled.tsx") -->

<!-- ud-demo("结合表单", "结合表单使用", "demos/form.tsx") -->
