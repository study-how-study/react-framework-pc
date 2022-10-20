---
title: formUtils
subtitle: form工具方法
category: utils
order: 3
---

包含一些表单相关的工具方法。

最主要是为了支持一个表单控件支持映射到多个字段。

## handleInitialValues

处理表单初始值，将字段名中包含 `|` 的字段进行分割处理，映射成多个字段。方法返回最终映射好的初始值。

### 方法签名

```ts
/**
 * 处理表单初始值
 * @param initialValues 表单初始值
 * @param items 表单项定义集合
 */
handleInitialValues: (
  initialValues: Store | undefined,
  items: (IUdFormItem | null | false)[] | undefined
): Store | undefined => {};
```

### 使用例子

```ts
let items = [
  { label: "名称", name: "title" },
  { label: "时间范围", name: "startTime|endTime" },
];

let initialValues = {
  title: "测试标题",
  "startTime|endTime": ["2020-08-10 10:00:00", "2020-08-26 10:00:00"],
};

let result = formUtils.handleInitialValues(initialValues, items);
// {
//   title: '测试标题',
//   startTime: '2020-08-10 10:00:00',
//   endTime: '2020-08-26 10:00:00'
// }
```

---

## handleValues

处理表单值，将字段名中包含 `|` 的字段进行分割处理，映射成多个字段。方法返回最终映射好的值。

### 方法签名

```ts
/**
 * 处理表单值
 * @param values 表单值
 * @param keepEmptyItem 是否保留字段值为空的字段
 * @param useTrim 是否去掉前后空格，仅对 string 类型的字段值有效性
 */
handleValues: (
  values: Store,
  keepEmptyItem: boolean = false,
  useTrim: boolean = true
) => {};
```

---

## getValues

获取表单的值，将字段名中包含 `|` 的字段进行分割处理，映射成多个字段。方法返回最终映射好的值。

### 方法签名

```ts
/**
 * 获取表单的值
 * @param form 表单实例对象
 * @param keepEmptyItem 是否保留字段值为空的字段
 * @param useTrim 是否去掉前后空格，仅对 string 类型的字段值有效性
 */
getValues: (
  form: FormInstance,
  keepEmptyItem: boolean = false,
  useTrim: boolean = true
) => {};
```

---

## setValues

设置表单的值，将字段名中包含 `|` 的字段进行分割处理，映射成多个字段。方法将最终映射好的值设置到表单中。

### 方法签名

```ts
/**
 * 设置表单的值
 * @param form 表单实例对象
 * @param values 表单的值
 */
setValues: (
  form: FormInstance,
  items: (IUdFormItem | null | false)[] | undefined,
  values: Store | undefined
) => {};
```

---

## getItemKey

获取表单项的 key

### 方法签名

```ts
/**
 * 获取表单项key
 * @param item 表单项定义
 * @param index 表单项定义的索引
 */
getItemKey: (item: IUdFormItem, index?: number): string => {};
```
