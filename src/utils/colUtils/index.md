---
title: colUtils
subtitle: 栅格工具方法
category: utils
order: 4
---

栅格布局工具集。

## calcSpan

根据容器宽度计算最终适合的 span。

### 方法签名

```ts
/**
 * 计算span
 * @param containerWidth 容器宽度
 * @param col 响应定义
 * @param defaultValue 默认值
 */
calcSpan: (
  containerWidth: number | undefined,
  col: IColSpan,
  defaultValue: number
): number => {};
```
