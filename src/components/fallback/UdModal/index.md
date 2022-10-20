---
title: UdModal
subtitle: 模态框
category: fallback
order: 1
---

本组件基于`Antd Modal`，保留了绝大部分原来功能。新增了如下主要新功能：

1. 可直接调用，无须在 render 函数中写一堆代码。
2. `onOk` 支持异步。
3. 支持同步或异步获取模态框的内容。

> 该模态框中的 content 无法和 state 联动，如果有复杂的状态可封装成单独的组件，再在 content 中使用。

## API

支持通过 `UdModal.defaultProps` 配置 `open` 方法的 `默认 props`。

<!-- ud-ts("index.tsx", "IUdModelProps") -->

<!-- ud-ts("index.tsx", "IUdModalContentProps") -->

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->

<!-- ud-demo("自定义用法", "自定义内容点击模态框确定按钮获取组件值", "demos/custom.tsx") -->

<!-- ud-demo("弹窗异步用法", "异步控制弹窗是否关闭", "demos/asynchronous.tsx") -->

<!-- ud-demo("内容很多的情况", "内容很多时候，内部自动出现滚动条", "demos/overflow.tsx") -->

<!-- ud-demo("步骤模态框", "模态框和步骤的结合", "demos/steps.tsx") -->
