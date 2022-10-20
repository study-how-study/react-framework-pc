---
title: UdButton
subtitle: 按钮
category: other
order: 1
---

基于 `Antd Button`，额外增加了 `auth` 属性，用于判断权限。如果没权限渲染结果为 null。

默认使用 `uaaApp.canUse` 来判断权限，可重写 `uaaApp.canUse` 或 `UdButton.defaultProps.canUse` 实现自定义逻辑。

## API

<!-- ud-ts("index.tsx", "IUdButton") -->

## 例子

```tsx
<UdButton auth="ADD_USER" type="primary">添加用户</UdButton>
```
