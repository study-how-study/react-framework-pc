---
title: 快速上手
subtitle: Started
category: home
order: 2
---

## 手工安装

> 仅支持使用 `npm` 或 `yarn` 的方式进行安装，推荐使用 `yarn`。

### 1、配置 npm registry

安装前需要配置项目的 `.npmrc` 文件。配置内容为：`registry = http://frontend-npm.1919.cn/`

> 具体请参考 [公司内网 npm 使用说明](http://10.4.100.71:8000/wiki/private-npm.html)

### 2、安装 npm 包

执行命令

```bash
yarn add @ud/admin-framework
```

或

```bash
npm i @ud/admin-framework --save
```

### 3、引入样式

在 `index.tsx` 入口文件中引入样式。

```tsx
import "@ud/admin-framework/lib/theme/aliyun-v1.less";
```

> `aliyun-v1.less` 文件中已经包含了 antd 的 less 文件，无须单独再引用。

**如果是全新项目，可参考 [模板项目](http://10.4.100.71:10080/huyao/template-cp-react)。**

---

## 通过工具安装

我们开发了一个 vs code 插件，其中 `创建项目` 功能可自动完成以上操作。

> 具体使用方法请参考 Ud Toolkit - 创建项目 （暂无文档）
