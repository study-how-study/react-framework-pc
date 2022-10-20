import _ from 'lodash'
import { FormInstance } from 'antd/lib/form'
import { Store } from 'antd/lib/form/interface'
import { IUdFormItem } from '../../'

/**
 * 表单工具集
 */
let formUtils = {
  /**
   * 处理表单初始值
   * @param initialValues 表单初始值
   * @param items 表单项定义集合
   */
  handleInitialValues: (initialValues: Store | undefined, items: (IUdFormItem | null | false)[] | undefined): Store | undefined => {
    if (
      _.isObject(initialValues) && Object.keys(initialValues).length > 0
      &&
      _.isArray(items) && items.length > 0
    ) {
      let result = _.cloneDeep(initialValues)
      for (const item of items) {
        if (item && _.isString(item.name)) {
          let names = item.name.split('|')
          if (names.length > 1) {
            let values = []
            for (let i = 0; i < names.length; i++) {
              values[i] = result[names[i]]
              delete result[names[i]]
            }
            result[item.name] = values
          }
        }
      }
      return result
    }
  },
  /**
   * 处理表单值
   * @param values 表单值
   * @param keepEmptyItem 是否保留字段值为空的字段
   * @param useTrim 是否去掉前后空格，仅对 string 类型的字段值有效性
   */
  handleValues: (values: Store, keepEmptyItem: boolean = false, useTrim: boolean = true) => {
    let items: Store = {}
    for (const id in values) {
      let keys = id.split('|')
      if (keys.length == 1) {
        if (keepEmptyItem || (values[id] != null && values[id] !== '')) {
          if (_.isString(values[id])) {
            items[id] = useTrim ? values[id].trim() : values[id]
          } else {
            items[id] = values[id]
          }
        }
      } else {
        for (let i = 0; i < keys.length; i++) {
          if (keepEmptyItem || (values[id] && values[id][i] != null && values[id][i] !== '')) {
            if (_.isString(values[id][i])) {
              items[keys[i]] = useTrim ? values[id][i].trim() : values[id][i]
            } else {
              items[keys[i]] = values[id][i]
            }
          }
        }
      }
    }
    return items
  },
  /**
   * 获取表单的值
   * @param form 表单实例对象
   * @param keepEmptyItem 是否保留字段值为空的字段
   * @param useTrim 是否去掉前后空格，仅对 string 类型的字段值有效性
   */
  getValues: (form: FormInstance, keepEmptyItem: boolean = false, useTrim: boolean = true) => {
    let values = form.getFieldsValue()
    return formUtils.handleValues(values, keepEmptyItem, useTrim)
  },
  /**
   * 设置表单的值
   * @param form 表单实例对象
   * @param values 表单的值
   */
  setValues: (form: FormInstance, items: (IUdFormItem | null | false)[] | undefined, values: Store | undefined) => {
    let result: any = {}
    if (values && items && items.length > 0) {
      for (const item of items) {
        if (!item) {
          continue
        }
        if (_.isString(item.name) && item.name.indexOf('|') > -1) {
          let keys = item.name.split('|')
          let val: any[] = []
          if (keys.length > 0) {
            for (const key of keys) {
              if (values[key]) {
                val.push(values[key])
              } else {
                val = null as any
              }
            }
          }
          result[item.name] = val
        } else {
          result[item.name as any] = values[item.name as any]
        }
      }
    }
    form.setFieldsValue(result)
  },
  /**
   * 获取表单项key
   * @param item 表单项定义
   * @param index 表单项定义的索引
   */
  getItemKey: (item: IUdFormItem, index?: number): string => {
    if (item.name) {
      if (_.isString(item.name)) {
        return item.name
      }
      if (_.isArray(item.name)) {
        return item.name.join('')
      }
      return item.name.toString()
    }
    if (index == null) {
      return ''
    }
    return index.toString()
  }
}

export { formUtils }
