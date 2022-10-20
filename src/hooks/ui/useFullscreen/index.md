---
title: useFullScreen
subtitle: 页面全屏
category: ui
order: 5
---

用于页面全屏处理

参考的 [ahook useFullScreen](https://ahooks.js.org/zh-CN/hooks/dom/use-fullScreen)

## API

`const [isFullscreen, { setFull, exitFull, toggleFull }] = useFullscreen(target);`

## Params

| 参数   |   说明   |                 类型 | 默认值   |
| :----- | :------: | -------------------: | :------- |
| target | 可选参数 | HTMLElement/Document | document |

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->
