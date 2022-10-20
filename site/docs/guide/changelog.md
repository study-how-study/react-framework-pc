---
title: 更新日志
subtitle: Changelog
category: home
order: 6
---

更新日志可能存在遗漏和错误，如存在不一样的地方，请以实际代码为准。

## 新增

### useBaseListPage

新增功能，BaseListPage 的 Hooks 版本，功能和 BaseListPage 基本一致。写法上更加简洁易懂。[详情](#/pages/useBaseListPage)

### useBaseDetailPage

新增功能，BaseDetailPage 的 Hooks 版本，功能和 BaseDetailPage 基本一致。写法上更加简洁易懂。[详情](#/pages/useBaseDetailPage)

### UdButton

新增组件，基于 `Antd Button`，额外增加了 `auth` 属性，用于判断权限。[详情](#/components/UdButton)

### UdSuspense

新增组件，页面组件懒加载器。[详情](#/components/UdSuspense)

### UdCheckbox

新增组件，基于 `Antd Checkbox`，额外增加了一些功能。[详情](#/components/UdCheckbox)

### UdFormList

新增组件，基于 `Antd Form.List`，快速实现可增减的动态表单项。

---

## 修改

### BaseListPage

- [新增]：`title` props，可通过路由传递此 props，优先级低于 state 中的 title。
- [新增]：`queryAfterMount` state，挂载成功后是否发起查询，默认值为：true。
- [新增]：`useFrontendPager` state，使用前端分页，默认值为：false。
- [新增]：`searchAfterReset` state，重置条件后是否发起查询，默认值为：true。
- [新增]：`useFilterFold` state，使用条件过滤器的折叠功能，默认值为：true。
- [新增]：`useHeaderAffix` state，使用列表页头部是否固定，默认值为：true。
- [新增]：`selectedRowCount` 属性，获取表格当前勾选的条数。
- [新增]：`queryBefore` 方法，在发起查询前执行，可在子类重写此方法来达到阻止查询或查询前处理其他业务。
  ```ts
  protected queryBefore = (params: any): (Promise<void> | boolean | void) => {
    return true
  }
  ```
- [修改]：检索条件初始值赋值方式修改为：用 `conditionInitialValues` state 赋值。
- [修改]：调整 `baseQueryParams` 优先于 `queryParams.conditions`。
- [修改]：`handleDataSource` 方法，新增参数 `res: AxiosResponse<IListRes<any>>`。
- [修改]：`columns` state 为空时，不会渲染表格。
- [修改]：`allowCustomColumns` state 配置列表列，更名为`useColumnCustomize`。
- [修改]：`allowExport` state 配置列表导出，更名为`useExport`。
- [修改]：`saveParamsWithUrl` 子类成员移至 state 内，默认值为 `true`。
- [删除]：`getConditionsInitialValues` 方法。
- [删除]：`showColumns` state。

### UdTable

> 用 hook 重写了该组件

- [新增]：允许用户修改列的宽度
- [新增]：允许用户调整列的显示顺序
- [新增]：列支持 `required` 字段，设置后同时会附加一个 `col-required` 的 className
- [修改]：列 className 从`tableexport-{dataType}`更名为`col-type-{dataType}`
- [修改]：列 className 从`text-overflow`更名为`col-text-overflow`

### UdForm

> 用 hook 重写了该组件

- [新增]：支持更多的布局方式：`horizontal`、`inline`、`vertical`、`grid`，之前仅支持一种。
- [新增]：支持表单项之间联动。
- [新增]：新增 `header` 插槽属性。
- [新增]：增加 `btns` 属性，用于配置表单的按钮。
- [修改]：`footer` 原来的作用是配置表单按钮，现改成 插槽属性。

### UdDatePicker

> 用 hook 重写了该组件

- [新增]：`showTimeFormat` 属性，控制 `showTime` 的值等于 true 时的格式。
- [优化]：兼容更多不合法的值。

### UdDateRangePicker

> 用 hook 重写了该组件

- [新增]：`showTimeFormat` 属性，控制 `showTime` 的值等于 true 时的格式。
- [优化]：兼容更多不合法的值。

### UdNumberRange

> 用 hook 重写了该组件

- [新增]：新增多个属性，可同时对组件内部的两个 InputNumber 设置。

### UdAjaxSelect

> 原名叫 UdSelectAjax

> 用 hook 重写了该组件

- [新增]：`queryAfterMount` props， 组件挂载后是否发起查询，默认值 `true`。
- [新增]：`method` props，请求方式，仅在 query 为 string 类型时有效，默认值 `POST`。
- [新增]：`params` props，请求参数，仅在 query 为 string 类型时有效。
- [新增]：`query` props，新增支持 string 类型的参数。
- [新增]：`UdAjaxSelect.defaultProps`，用于设置 props 的默认值。
- [新增]：`UdAjaxSelect.defaultMappingSchemes`，用于设置默认映射方案。

---

### UdDetail

> 重构成了方法组件

- [删除]：`items` 不再支持精简写法。

## 删除

### UdDetailGroup

删除原因：使用频率极低，且封装的内容较少所以暂时从项目中删除。

### UdAdvancedForm

删除原因：使用频率极低，且封装的内容较少所以暂时从项目中删除。