---
title: useSetState
subtitle: 合并State
category: state
order: 1
---

useSetState 和 class 组件中的 this.setState 类似，不过此方法默认是 `深合并`，而前者是浅合并。

> hooks 中的 useState 进行 setState 时会进行替换操作，和 class 组件中的 this.setState 浅合并操作不一样。

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->
