import React from 'react'
import { IDocItem } from '../typings'
import { BasePage, ICategory } from '../components'


const Pages: React.FC<IPagesProps> = (props) => {

  const categorys: ICategory[] = [
    { code: 'home', title: '' },
    { code: 'class', title: 'Class 版本' },
    { code: 'hooks', title: 'Hooks 版本' }
  ]

  return <BasePage path="pages" categorys={categorys} docs={props.items} />
}

interface IPagesProps {
  items: IDocItem[]
}

export { Pages }
