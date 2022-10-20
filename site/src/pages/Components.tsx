import _ from 'lodash'
import React from 'react'
import { ICategory, BasePage } from '../components'
import { IDocItem } from '../typings'

const Components: React.FC<IComponentsProps> = (props) => {

  const categorys: ICategory[] = [
    { code: 'home', title: '' },
    { code: 'layout', title: '布局' },
    { code: 'nav', title: '导航' },
    { code: 'form', title: '表单' },
    { code: 'formControl', title: '表单控件' },
    { code: 'dataViewer', title: '数据展示' },
    { code: 'fallback', title: '反馈' },
    { code: 'other', title: '其他' },
  ]

  return <BasePage path="components" categorys={categorys} docs={props.items} />
}

interface IComponentsProps {
  items: IDocItem[]
}

export { Components }