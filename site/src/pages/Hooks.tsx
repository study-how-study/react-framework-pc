import React from 'react'
import { IDocItem } from '../typings'
import { ICategory, BasePage } from '../components'

const Hooks: React.FC<IHooksProps> = (props) => {

  const categorys: ICategory[] = [
    { code: 'home', title: '' },
    { code: 'state', title: '状态' },
    { code: 'lifecycle', title: '生命周期' },
    { code: 'ui', title: '界面' },
    { code: 'advanced', title: '高级' },
    { code: 'side-effects', title: '副作用' },
  ]

  return <BasePage path="hooks" categorys={categorys} docs={props.items} />
}

interface IHooksProps {
  items: IDocItem[]
}

export { Hooks }
