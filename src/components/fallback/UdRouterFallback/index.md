---
title: UdRouterFallback
subtitle: 懒加载Loding页面
category: fallback
order: 3
---

UdRouterFallback，该组件用于路由懒加载时 loding 效果。

> 该组件属于 界面约束 组件

**新项目中建议直接使用 UdSuspense 组件**

## API

无

## 默认样式

<!--ud-code("css","style.less")-->

## 例子

```tsx
import { UdRouterFallback } from '@ud/admin-framework'

<Suspense fallback={<UdRouterFallback />}>
  <Switch>
    { ... }
  </Switch>
</Suspense>
```
