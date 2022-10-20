import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { AppHeader, AppFooter } from './components'
import { Home, Guide, Components, Pages, Hooks, Other } from './pages'
import './App.less'

const { docs } = require('../docs/index.js')

console.log(docs)

const App: React.FC = () => {

  return (
    <ConfigProvider locale={zh_CN}>
      <HashRouter>
        <AppHeader />
        <Route path="/" exact component={Home} />
        <Route path="/guide" component={Guide} />
        <Route path="/components" render={(props) => (
          <Components items={docs.components} {...props} />
        )} />
        <Route path="/hooks" render={(props) => (
          <Hooks items={docs.hooks} {...props} />
        )} />
        <Route path="/pages" render={(props) => (
          <Pages items={docs.pages} {...props} />
        )} />
        <Route path="/other" render={(props) => (
          <Other items={docs.others} {...props} />
        )} />
        <AppFooter />
      </HashRouter>
    </ConfigProvider>
  )
}

export default App
