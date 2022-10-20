---
title: UdMenu
subtitle: 菜单
category: nav
order: 1
---

菜单，主要用于网站左侧主菜单。

相比普通菜单增加了，菜单项的高亮、菜单组的展开和收起，均和 url 变化做了关联。支持浏览器的前进后退刷新等操作。

> 下面的例子，因为文档网站的特殊情况，无法展示出上述的特性。可查看管理中心（UAA）中的菜单效果。

## API

### Props

<!-- ud-ts("index.tsx", "IUdMenuProps") -->

### IMenuItem

<!-- ud-ts("index.tsx", "IMenuItem") -->

### IMenuRelevants

```ts
export interface IMenuRelevants {
  [customId: string]: (string | RegExp)[]
}
```

### IMenuExtraPath

```ts
export interface IMenuExtraPath {
  [key: string]: (path: string) => string
}
```

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->