---
title: uaaApp
subtitle: UAA子系统
category: uaa
order: 1
path: /
---

包含了 UAA(管理中心) 子系统所需的一些基本方法。

## 使用例子

```ts
import { uaaApp, IUaaAppStartOptions } from "@ud/admin-framework";

let options: IUaaAppStartOptions = {
  appCode: "app-code",
  routes: [],
  success: () => {
    ReactDOM.render(<App />, document.getElementById("root"));
  },
};

uaaApp.start(options);
```

## 属性

### options

子系统启动时的相关参数。

### functionLimits

当前用户可用的权限集合。

### appName

子系统的中文名称，会通过 appCode 到 UAA 中获取。

### appCode

子系统的英文唯一标识。

### centerUrl

UAA（管理中心）的前端访问地址。

### menus

子系统的菜单集合（经过处理过的）。

### routes

子系统的路由集合（经过处理过的）。

### routesMaps

路由和 customId 的映射关系。

### fromOtherSystem

是否是其他 UAA 子系统调用。

---

## 方法

### start

启动一个子系统。

```ts
start(opts: IUaaAppStartOptions);
```

### startFail

启动失败提示。一般无需自己调用。

```ts
startFail(text?: string);
```

### processOptions

处理启动参数。一般无需自己调用。

```ts
processOptions(opts: IUaaAppStartOptions);
```

### processRoutes

处理路由集合。一般无需自己调用。

```ts
processRoutes(routes: IRouteItem[]);
```

### transformMenus

转换菜单集合。一般无需自己调用。

```ts
transformMenus(old: IUaaMenu[] | undefined): IMenuItem[];
```

### transformMenu

转换菜单项。一般无需自己调用。

```ts
transformMenu(old: IUaaMenu): IMenuItem;
```

### refreshToken

刷新 token。一般无需自己调用。

```ts
refreshToken();
```

### setToken

设置 Token。一般无需自己调用。

> obj 参数为空时，则表示删除已有的 token。

```ts
setToken(obj?: IUaaTokenData);
```

### getToken

获取 Token。

```ts
getToken(): IUaaTokenData | undefined;
```

### getSysInfo

获取用户、系统信息。

```ts
getSysInfo(): IUaaAppInfo | undefined;
```

### setSysInfo

设置用户、系统信息。一般无需自己调用。

> obj 参数为空时，则表示删除已有的信息。

```ts
setSysInfo(obj?: IUaaAppInfo);
```

### signOut

退出登录。

会删除本地存储的 用户、系统、token 等信息。并通知 UAA。

### closeLoader

关闭启动加载动画。一般无需自己调用。

```ts
closeLoader(delay: number = 300);
```

### canUse

判断是否有权限。

```ts
canUse(key: string): boolean;
```

### sendMessage

发送消息到 UAA 系统。

```ts
sendMessage(message: IMessage, callback?: (data: any) => void);
```
