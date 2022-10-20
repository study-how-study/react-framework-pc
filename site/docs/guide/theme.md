---
title: 主题
subtitle: Theme
category: home
order: 3
---

`v2` 版本中去掉了对 `@ud/antd-theme` 的依赖，改变了实现方案。

改用 `less` 编译 `antd 样式`，覆写 less 变量的方案。

框架中已经集成了 公司后台管理系统主题风格，可直接引入使用。

antd 样式使用 less 编译需要做相关配置，可参考 [antd 定制主题](http://4-5-3.antd.site/docs/react/customize-theme-cn)。

使用公司内部脚手架创建的项目，已集成相关配置。

---

## 如何引用

在项目入口 js 文件中 引入

```ts
import "@ud/admin-framework/lib/theme/aliyun-v1.less";
```

> 该 less 文件中，已经包含了 `antd.less`；

## 修改主题

方式方法很多，包括不限于以下几种：

1. 不引用 `aliyun-v1.less` 文件，自行引用 `antd.less` 后，再进行 less 变量和样式覆盖；

2. 新建一个 less 文件，文件中引用 `aliyun-v1.less`，再进行 less 变量和样式覆盖；

3. 直接修改 css3 变量的值；

## css3 变量

`aliyun-v1.less` 包含以下 css 变量和默认值，可在项目中使用。

```css
:root {
  --primary-color: #00c1de;
  --border-radius-base: 0px;
}
```

> 自己写的主题也必须要包含以上的 css3 变量，不然会有样式问题。
