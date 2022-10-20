import React from 'react'
import { IDocItem } from '../typings'
import { BasePage, ICategory } from '../components'


const Other: React.FC<IOtherProps> = (props) => {

  const categorys: ICategory[] = [
    // { code: 'home', title: '' },
    { code: 'uaa', title: '管理中心' },
    { code: 'config', title: '配置' },
    { code: 'utils', title: '工具' }
  ]

  return <BasePage path="other" categorys={categorys} docs={props.items} />
}

interface IOtherProps {
  items: IDocItem[]
}

export { Other }
