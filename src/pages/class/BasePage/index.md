---
title: BasePage
subtitle: 基础页面
category: class
order: 0
---

基础页面，主要功能是处理 url query string。

**单页模式下(SPA)通过读取和设置 url query string 来支持浏览器的前进后退功能，大部分情况下优于其他方案。**

> 使用时继承该类，不能单独使用。

## 主要功能

- 读取 url query string 和默认参数进行合并，得到最终的参数。
- url query 参数发生改变时通知。
- 将新的 query 参数 push 到 url 中。

## 继承关系

```mermaid
graph LR
  BasePage --> React.Component
```

## 类的泛型参数

- P ：Props，必须继承与 `RouteComponentProps` ，默认值 `RouteComponentProps`。
- S ：State，默认值 `{}`。
- QP ：QueryParams 类型，默认值 `any`。

## 执行过程

- ### 挂载阶段

  ```mermaid
  graph LR
    componentWillMount --> processSearchString --> queryParams
  ```

- ### 运行阶段

  ```mermaid
  graph LR
    componentWillReceiveProps --> processSearchString --> queryParams --> queryParamsChanged
    url地址改变 --> componentWillReceiveProps
    pushQueryParams --> url地址改变
    浏览器前进后退或其他操作 --> url地址改变
  ```

## 子类可用成员

- ### defaultQueryParams，默认查询参数

  ```ts
  protected defaultQueryParams: QP = {} as QP
  ```

  - 没有设置默认值的参数，即便 url 有传入值，也无法通过 `this.queryParams` 获取。
  - 设置参数默认值的类型，决定了此参数的数据类型。
  - 数据类型支持：string、boolean、number、object、function。`暂不支持数组`。

  > boolean：1、'1'、'true' 都将转换为 true，0、'0'、'false' 都将转换为 false

  > number：支持小数、负数

  > object：支持多层嵌套

  > function：可用于参数自定义处理逻辑

* ### queryParams，当前查询参数

  ```ts
  protected queryParams: QP = {} as QP
  ```

  - 在 `componentWillMount` 生命周期里获取初始值。不会触发 queryParamsChanged。
  - 在 `componentWillReceiveProps` 生命周期里获取变更后的值。会触发 queryParamsChanged。

  **如子类要使用这两个生命周期函数，请一定要先调用父类对应的生命周期函数。如：**

  ```tsx
  import { BasePage } from "@ud/admin-framework";

  class Demo extends BasePage {
    protected componentWillMount() {
      super.componentWillMount(); // 调用父类 BasePage 的 componentWillMount，如果不调用将完全覆盖父类的逻辑。
      console.log("子类要做的事情。");
    }
  }
  export default Demo;
  ```

- ### pushQueryParams，改变查询参数
  改变查询参数应该通过此方法，而不是自己修改 this.queryParams。（特殊情况除外)
  ```ts
  /**
   * 改变查询参数
   * @param params 要改变的参数
   * @param merge true：合并，false：替换
   */
  protected pushQueryParams<T = any>(params?: Partial<T>, merge: boolean = true): void { }
  ```

* ### queryParamsChanged，查询参数发生改变后
  当 url query string 发生改变，并得到新的 this.queryParams 后会调用该方法。
  ```ts
  protected queryParamsChanged = () => { // .. }
  ```

- ### processSearchString，处理 url 查询参数字符串
  一般不需要关心此方法，除非你需要自定义 url query string 的处理逻辑。
  ```ts
  /**
   * 处理 url 查询参数字符串
   * @param searchString 待处理的 url 查询参数字符串
   * @description 处理完后，直接将结果赋值给 this.queryParams
   */
  protected processSearchString(searchString: string): void { }
  ```
  **会把传入的 searchString 转换成对象和 defaultQueryParams 合并，得到最终的 queryParams。**

## 例子

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->
