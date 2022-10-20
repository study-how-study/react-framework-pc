import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'
import { BugOutlined, HistoryOutlined, IssuesCloseOutlined } from '@ant-design/icons'
import './AppFooter.less'

const data: IData[] = [
  {
    title: '相关资源',
    items: [
      { title: 'Ant Design', url: 'https://ant.design/index-cn' },
      { title: 'Table Export', subtitle: '列表导出', url: 'https://tableexport.v3.travismclarke.com/' },
      { title: 'React Sortable', subtitle: '列表排序', url: 'https://www.npmjs.com/package/react-sortablejs' }
    ]
  },
  {
    title: '帮助',
    items: [
      { title: <><HistoryOutlined />更新日志</>, url: '#/guide/Changelog' },
      { title: <><IssuesCloseOutlined />问题讨论</>, url: 'http://git.tuna.1919.cn/front-end/ud-admin-framework-next/issues' },
      { title: <><BugOutlined />报告Bug</>, url: 'http://git.tuna.1919.cn/front-end/ud-admin-framework-next/issues/new' }
    ]
  },
  {
    title: '更多',
    items: [
      { title: '前端文档库', url: 'http://10.4.100.71:8000/' },
      { title: 'Private NPM', subtitle: '公司私有npm', url: 'http://frontend-npm.1919.cn/' },
      { title: 'Swagger Hub', subtitle: '接口文档', url: 'https://swagger-hub.1919.cn/' }
    ]
  }
]

const AppFooter = () => {

  const location = useLocation()

  return (
    <div className={classNames('app-footer', { 'home': location.pathname == '/' })}>
      <div className="content">
        {data.map((n, i) => (
          <div key={i} className="item">
            <h2 className="title">{n.title}</h2>
            <ul className="list">
              {
                n.items.map((v, i) => (
                  <li key={i}>
                    <a href={v.url} target="_Blank">{v.title}</a>{v.subtitle && <span className="subtitle"> - {v.subtitle}</span>}
                  </li>
                ))
              }
            </ul>
          </div>
        ))}
      </div>
      <div className="copyright">©{new Date().getFullYear()} 上加下信息科技有限公司</div>
    </div>
  )
}

interface IData {
  title: ReactNode
  items: IDataItem[]
}
interface IDataItem {
  title: ReactNode
  subtitle?: ReactNode
  url: string
}

export { AppFooter }
