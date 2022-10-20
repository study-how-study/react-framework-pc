---
title: useCreation
subtitle: 创建
category: advanced
order: 3
---

`useCreation` 是 `useMemo` 或 `useRef` 的替代品。

- 因为 `useMemo` 不能保证被 memo 的值一定不会被重计算，而`useCreation` 可以保证这一点
- 而相比于 `useRef`，你可以使用 `useCreation` 创建一些常量，这些常量和 `useRef` 创建出来的 ref 有很多使用场景上的相似，但对于复杂常量的创建，`useRef` 却容易出现潜在的性能隐患。

<!-- ud-demo("基本用法", "点击按钮除非组件跟新时，但Foo不会更新", "demos/basic.tsx") -->
