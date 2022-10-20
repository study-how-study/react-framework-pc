---
title: useContextMenu
subtitle: 右键菜单
category: ui
order: 6
---

右键菜单

> 比 antd 的 右键菜单更加灵活一些。

## API

`const { triggerElement, bindContextMenu } = useContextMenu();`

## Params

| 参数   |   说明   |                 类型 | 默认值   |
| :----- | :------: | -------------------: | :------- |
| triggerElement | 需要绑定右键菜单元素的Ref | `React.MutableRefObject<HTMLElement | undefined>` | |
| bindContextMenu | 绑定的右键菜单内容 | `(action: IUdContextMenuItem[] | ((e: any) => void | IUdContextMenuItem[])) => () => void` | |

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->
