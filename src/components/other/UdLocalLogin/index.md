---
title: UdLocalLogin
subtitle: 登录页面
category: other
order: 4
---

基于UAA系统本地开发时所用的登录组件。

只在本地开发时打包此页面，线上环境不打包此组件（单独引用此组件时除外）。

登录成功后`token、系统和用户相关信息`会存储下来，并且刷新页面。

> 一般情况下，验证码可以不用输入。

> 组件的背景图片是随机的。

## API

<!-- ud-ts("index.tsx", "IUdLoginProps") -->

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->
