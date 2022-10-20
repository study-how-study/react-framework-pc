---
title: http
subtitle: ajax 请求
category: uaa
order: 2
---

基于 axios 封装，符合公司内部的接口标准。

## 使用例子

```ts
import { http } from "@ud/admin-framework";

http.get("/users").then((res) => {
  console.log(res.data);
});
```

## 功能特性

1. 调用时，url 参数如果是以 http 或 https 开头的，则会自动忽略已经配置的 baseURL。
2. 请求默认会附带当前 token。
3. 请求默认使用 `x-rpc-wrap` http 头。
4. 内置业务错误处理器。（http 状态码为：200，并且）
   - 遇见业务错误：提示 `后端返回的错误信息`。
   - 可通过 `useBizErrorHandler` 配置是否使用。
5. 内置系统错误处理器。
   - 可通过 `useSysErrorHandler` 配置是否使用。
   - 发送请求失败：提示 `请求失败，并包含详细错误`。
   - 400：提示 `错误的请求，并包含后端返回的详细错误`。
   - 401：提示 `登录超时，并包含退出按钮`。
   - 403：提示 `没有权限，你的账号没有该操作的权限`。
   - 404：提示 `请求的资源不存在` 。
   - 500：提示 `后端返回的详细错误信息`，如果没有则提示 `系统错误，请稍后重试！`。
   - Network Error：提示 `网络异常，请检查你的网络。`
   - 其他：提示 `系统错误，请稍后重试！`
5. 支持接口报错时返回 `headers.x-b3-traceid` http header。会在错误提示界面显示出来。
