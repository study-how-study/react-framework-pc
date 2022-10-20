---
title: routeUtils
subtitle: 路由工具方法
category: utils
order: 7
---

包含一些路由相关的工具方法。

## parsePath

从一个路径地址，解析得到 3 个部分：path、query、hash。

### 方法签名

```ts
/**
 * 解析路径地址
 * @param path 路径地址
 */
parsePath: (path: string): IPath => {};

export interface IPath {
  path: string;
  query: string;
  hash: string;
}
```

---

## searchStringToObject

url 查询参数字符串转换成 js 对象。

> 根据传入的默认值转换，如果参数未在默认值中定义，将不会转换。

### 方法签名

```ts
/**
 * url查询字符串转对象
 * @param locationSearch url查询字符串
 * @param defaultValue 默认值，支持对象
 */
searchStringToObject: (locationSearch: string, defaultValue: any): any => {};
```

---

## objectToSearchString

js 对象转换成 url 查询参数字符串。

### 方法签名

```ts
/**
 * 对象转url查询字符串
 * @param queryParams 对象
 */
objectToSearchString: (queryParams: any): string => {};
```

---

## buildRouteNodes

根据传入的路由定义集合，构建出路由节点集合。

### 方法签名

```ts
/**
 * 路由集合生成路由组件
 * @param routes 路由定义集合
 */
buildRouteNodes: (routes: IRouteItem[]): ReactNode[] => {};
```

---

## getFirstPathFromMenu

从菜单集合中获取第一个有效的跳转路径

### 方法签名

```ts
/**
 * 从菜单集合中获取第一个有效的跳转路径
 * @param menus 菜单定义集合
 */
getFirstPathFromMenu: (menus: IMenuItem[]): string | undefined => {};
```
