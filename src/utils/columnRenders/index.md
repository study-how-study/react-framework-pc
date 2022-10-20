---
title: columnRenders
subtitle: 表格列渲染器
category: utils
order: 2
---

该渲染器只能配合列表页使用

## API

### columnRenders.title

该方法主要用于列表页点击文字跳转页面

```ts
columnRenders.title("/view?id=${id}");
```

### columnRenders.enum

该方法主要用于列表页后端返回枚举值前端应翻译后展示内容

> 大小写敏感。

```ts
columnRenders.enum({ enable: "启用", disable: "禁用" });
```

### columnRenders.datetime

该方法主要用于格式化后端返回的时间字段，如果不传参数默认为：YYYY-MM-DD HH:mm:ss

```ts
columnRenders.datetime("YYYY/MM/DD HH:mm:ss");
```

### columnRenders.switch

> 此功能未开发完

该方法主要用于让列表字段展示成 antd 的 switch 组件

```ts
columnRenders.switch();
```

### columnRenders.maxShowLength

该方法主要用于后端返回字符串内容过长会影响页面展示的情况下更改展示的内容

```ts
/**
 * 该方法第一个参数是只展示多少个字符多余部分用...表示,可不传默认为200
 * 第二个参数是是否使用Antd的Tooltip展示所有数据
 */
columnRenders.maxShowLength("只展示的长度（number）");
```

### columnRenders.operate

该方法主要用于展示列表页多个操作按钮的情况

- `title`为按钮描述
- `action`点击按钮后的动作
- `auth`按钮权限
- `show`返回布尔值设置按钮是否展示

```ts
columnRenders.operate([
  {
    title: "编辑",
    show:(text,row)=>{
      return true
    }
    auth:''
    action: (text: any, model: any) =>{},
  },
]);
```

## 例子

<!-- ud-demo("基本用法", "在demo中运用以上几个api", "demos/basic.tsx") -->
