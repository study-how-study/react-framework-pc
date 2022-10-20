import React from 'react'
import { BasePage, ICategory } from '../components'

let docs = [
  require('../../docs/guide/introduce.md'),
  require('../../docs/guide/started.md'),
  require('../../docs/guide/theme.md'),
  require('../../docs/guide/i18n.md'),
  require('../../../CHANGELOG.md'),
  require('../../docs/guide/faq.md'),
]

docs = docs.map(n => { return { index: n } })

const Guide: React.FC = () => {

  const categorys: ICategory[] = [
    { code: 'home', title: '' }
  ]

  return <BasePage path="guide" pathField="subtitle" categorys={categorys} docs={docs} />
}

export { Guide }
