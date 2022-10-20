---
title: UdSuspense
subtitle: 页面组件懒加载器
category: other
order: 3
---

UdSuspense，页面组件懒加载器。

基于官方 `Suspense`，内部已设置好 `fallback` ，并处理好了页面发生错误时的情况。

## 例子

```tsx
<UdSuspense>
  <Route path={"/p1"} component={lazy(() => import("../pages/P1"))} />
  <Route path={"/p2"} component={lazy(() => import("../pages/P2"))} />
  <Route path={"/p3"} component={lazy(() => import("../pages/P3"))} />
</UdSuspense>
```
