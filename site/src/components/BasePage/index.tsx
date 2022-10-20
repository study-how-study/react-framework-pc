import _ from 'lodash'
import React, { useMemo, useRef } from 'react'
import classNames from 'classnames'
import { NavLink, Route } from 'react-router-dom'
import { IDocItem, IDocItemMeta } from '../../typings'
import { DocViewer } from '../'
import { Affix } from 'antd'

const BasePage: React.FC<IBasePageProps> = (props) => {

  const categorys = useRef<ICategory[]>([])

  useMemo(() => {
    let result = _.cloneDeep(props.categorys)
    for (const parent of result) {
      let items = props.docs.filter(n => n.index.meta.category == parent.code).map(n => n.index.meta)
      parent.children = _.sortBy(items, n => n.order)
    }
    console.log(result,'ddddddddddddd')
    categorys.current = result
  }, [props.docs])

  return (
    <div className="page">
      <Affix offsetTop={0}>
        <div className="sidebar">
          <ul>
            {categorys.current && categorys.current.length > 0 && categorys.current.map((category) => {
              return (
                <li key={category.code} className={classNames('category-group', 'category-group-' + category.code)}>
                  {category.title && <span className="category-title">{category.title}</span>}
                  <ul>
                    {category.children && category.children.length > 0 && category.children.map(item => {
                      let path = `/${props.path}${item.path || ('/' + item[props.pathField])}`
                      return (
                        <li key={item.title}>
                          <NavLink to={path} exact activeClassName="active" title={`${item.title} - ${item.subtitle}`}>
                            {item.title}
                            <span>{item.subtitle}</span>
                          </NavLink>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      </Affix>
      <div className="page-main" id="pages-container">
        {props.docs.map(n => {
          let path = `/${props.path}${n.index.meta.path || ('/' + n.index.meta[props.pathField])}`
          return (
            <Route key={n.index.meta.title} path={path} exact render={() => (
              <DocViewer doc={n} containerId="page" />
            )} />
          )
        })}
      </div>
    </div>
  )
}

BasePage.defaultProps = {
  pathField: 'title'
}

export interface IBasePageProps {
  path: string
  pathField?: string
  categorys: ICategory[]
  docs: IDocItem[]
}

export interface ICategory {
  code: string
  title: string
  children?: IDocItemMeta[]
}

export { BasePage }
