import _ from 'lodash'
import pathToRegexp from 'path-to-regexp'
import React from 'react'
import ReactDOM from 'react-dom'
import { uaaMsgBus } from '..'
import { http, IMenuItem, ToByCustomId, UdIframePage, useThrottle } from '../..'
import { IUaaOriginLoginInfo, IUaaMenu, IUaaAppInfo, IUaaAppStartOptions, IRouteItem, IUaaTokenData, PostMessageTypes, IPostMessage, IUaaOtherEntry } from '../../typings'
import { buildAppExternalLink } from '../../utils'

class UaaApp {

  private listens: IListen = {}
  public options: IUaaAppStartOptions = {} as IUaaAppStartOptions
  public functionLimits: Set<string> = new Set()
  public customIdMap: Map<string, IUaaMenu> = new Map()

  /** 系统名称(会自动从uaa中的菜单获取) */
  public appName: string = ''
  /** 系统唯一标识 */
  public appCode: string = ''
  /** 管理中心(uaa)前端访问地址 */
  public centerUrl: string = ''

  /** 菜单表 */
  public menus: IMenuItem[] = []
  /** 路由表 */
  public routes: IRouteItem[] = []
  /** customId 和 routeitem 映射对象 */
  public routesMaps: { [key in string]: IRouteItem } = {}

  /** 是否是其他非uaa子系统调用 */
  public fromOtherSystem: boolean = false

  private otherEntry: IUaaOtherEntry | null = null

  /** 启动系统 */
  public start(opts: IUaaAppStartOptions) {
    this.processOptions(opts)
    this.otherEntry = this.matchOtherEntry()

    if (!this.judgeRunEnv()) {
      return
    }
    this.processRoutes(this.routes)
    this.subscribePostMessage()

    if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'local2') {
      this.startFromLocal()
    } else {
      this.startFromServer()
      opts.useActiveWatcher && this.startActiveWatcher()
    }
  }

  public judgeRunEnv() {
    if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'local2') {
      return true
    }
    // 部署后如果发现子系统未处于管理中心（iframe）里面，将重新跳转到管理中心去打开待访问的页面
    if (!this.fromOtherSystem && window.top === window) {
      let path = location.hash
      if (path.startsWith('#')) {
        path = path.substring(1)
      }
      location.href = buildAppExternalLink(path)
      return false
    }
    return true
  }

  public startFromLocal() {
    let token = this.getToken()
    if (token == null) {
      let Login: any = this.options.loginComponent
      if (!Login) {
        Login = require('../../components/other/UdLocalLogin').default
      }
      ReactDOM.render(<Login {...this.options.local} />, document.getElementById('root'))
    } else {
      let sysInfo: IUaaOriginLoginInfo = {
        Authorization: token,
        urls: {},
        systemSelectKey: ''
      } as IUaaOriginLoginInfo
      if (this.options.local!.useLocalMenu) {
        sysInfo.systemInfo = {
          generalMenus: [
            {
              application: this.appCode,
              items: this.options.local!.menus,
              text: '本地数据'
            } as IUaaMenu
          ]
        } as IUaaAppInfo
      } else {
        let info = this.getSysInfo()
        if (info) {
          sysInfo.systemInfo = info
        } else {
          throw new Error('Storage UaaSysInfo 的值不合法。')
        }
      }
      this.startInner(sysInfo)
    }
  }

  public startFromServer() {
    if (this.options.loginComponent) {
      let Login = this.options.loginComponent as any
      ReactDOM.render(<Login {...this.options} />, document.getElementById('root'))
    } else {
      let success = false
      setTimeout(() => {
        if (!success) {
          this.startFail()
        }
      }, 3000)
      this.sendMessage({ type: PostMessageTypes.GetOriginLoginInfo }, (data: IUaaOriginLoginInfo) => {
        if (data && data.Authorization && data.systemInfo) {
          success = true
          this.startInner(data)
        } else {
          console.log('启动时获取到的数据有误', data)
        }
      })
    }
  }

  public startInner(data: IUaaOriginLoginInfo) {
    let menus = data.systemInfo.generalMenus.find(n => n.application == this.appCode)
    if (menus == null) {
      if (this.fromOtherSystem) {
        menus = { application: this.appCode, customId: this.appCode, text: '', items: [] }
      } else {
        if (this.otherEntry == null || this.otherEntry.type === 'standard') {
          if (process.env.NODE_ENV == 'development') {
            this.startFail(`找不到${this.appCode}的菜单定义，可能是菜单未上报或该账号没有权限。`)
          } else {
            this.startFail(`启动失败，很可能是你的账号没有访问该系统的权限。`)
          }
          return
        }
      }
    }
    if (menus) {
      this.appName = menus.text
      this.menus = this.transformMenus(menus.items)
    }
    if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'local2') {
      if (!this.options.local!.apiBaseUrl) {
        http.defaults.baseURL = data.urls[this.appCode]
      }
    } else {
      this.setToken(data.Authorization)
      this.setSysInfo(data.systemInfo)
      http.defaults.baseURL = data.urls[this.appCode]
    }

    window.setInterval(this.refreshToken.bind(this), 10 * 60 * 1000)
    if (this.options.useMsgBus) {
      uaaMsgBus.init()
    }

    if (this.otherEntry) {
      this.options.success(this.otherEntry)
    } else {
      this.options.success()
    }
    setTimeout(() => { this.closeLoader() }, 100)
  }

  private matchOtherEntry() {
    if (this.options.otherEntry && this.options.otherEntry.length > 0) {
      let path = location.hash.startsWith('#') ? location.hash.substring(1) : location.hash
      for (const item of this.options.otherEntry) {
        let regex = pathToRegexp(item.path)
        if (path.match(regex)) {
          return item
        }
      }
    }
  }

  public startFail(text?: string): void {
    document.body.innerHTML = `<div class="ud-start-fail">${text || '启动失败'}</div>`
  }

  public processOptions(opts: IUaaAppStartOptions): void {
    this.options = opts

    const paramValue = new URLSearchParams(window.location.search).get('fromOtherSystem')
    this.fromOtherSystem = paramValue && paramValue.length > 0 && paramValue !== 'false'

    if (this.options.autoMapMenu == null) {
      this.options.autoMapMenu = true
    }
    if (this.options.useMsgBus == null) {
      this.options.useMsgBus = true
    }

    this.appCode = opts.appCode

    if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'local2') {
      if (opts.local!.apiBaseUrl) {
        http.defaults.baseURL = opts.local!.apiBaseUrl
      }
    }
    if (opts.centerUrl) {
      this.centerUrl = opts.centerUrl
    } else {
      if (process.env.REACT_APP_ENV == 'dev') {
        this.centerUrl = 'http://10.10.10.137'
      } else if (process.env.REACT_APP_ENV == 'local2') {
        this.centerUrl = 'https://manage-test2.test1919.cn'
      } else if (process.env.REACT_APP_ENV == 'test') {
        this.centerUrl = 'https://manage-test.test1919.cn'
      } else if (process.env.REACT_APP_ENV == 'test2') {
        this.centerUrl = 'https://manage-test2.test1919.cn'
      } else if (process.env.REACT_APP_ENV == 'prod') {
        this.centerUrl = 'https://manage.1919.cn'
      }
    }
    this.routes = opts.routes

    if (this.options.otherEntry) {
      this.options.otherEntry.forEach(n => {
        if (n.type == null) {
          n.type = 'standard'
        }
      })
    }
  }

  public processRoutes = (routes: IRouteItem[]): void => {

    const recursion = (routes: IRouteItem[] | undefined) => {
      if (routes) {
        for (const item of routes) {
          if (item.customId) {
            if (_.isArray(item.customId)) {
              for (const id of item.customId) {
                this.routesMaps[id] = item
              }
            } else {
              this.routesMaps[item.customId] = item
            }
          }
          let hasChildren = _.isArray(item.children) && item.children.length > 0
          if (hasChildren) {
            recursion(item.children)
          }
        }
      }
    }
    recursion(routes)

    routes.unshift({ path: '/to-by-custom-id/:customId', exact: true, component: ToByCustomId })
    routes.unshift({ path: '/to-by-iframe', exact: true, component: UdIframePage })

  }

  public transformMenus = (old: IUaaMenu[] | undefined): IMenuItem[] => {
    let res: IMenuItem[] = []
    let recursion = (items: IUaaMenu[] | undefined, parentMenu?: IMenuItem): IMenuItem[] => {
      if (!_.isArray(items) || items.length == 0) {
        return []
      }
      let menus: IMenuItem[] = []
      for (const item of items) {
        let isMenu = item.type == 'GROUP' || item.type == 'INNER_LINK' || item.type == 'BLANK_LINK'

        this.customIdMap.set(item.customId, item)

        if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'local2') {
          if (this.options.local!.useLocalMenu) {
            isMenu = true
          }
        }
        if (isMenu) {
          let menu: IMenuItem = this.transformMenu.call(this, item)
          if (this.options.autoMapMenu) {
            if (this.routesMaps[item.customId]) {
              menu.path = this.routesMaps[item.customId].path as string
              if (item.type == 'INNER_LINK') {
                menu.externalUrl = '#' + menu.path
              }
            } else {
              if (process.env.NODE_ENV == 'development' && item.type == 'INNER_LINK') {
                console.error(`没有找到菜单${item.text} - ${item.customId}，所对应的路由。`)
              }
            }
          }
          menu.children = recursion(item.items, menu)
          menus.push(menu)
        }
        if (item.type == 'RESOURCE_INNER_LINK') {
          if (!this.functionLimits.has(item.customId)) {
            this.functionLimits.add(item.customId)
          }
          if (this.routesMaps[item.customId] && parentMenu) {
            parentMenu.relevantPaths = parentMenu.relevantPaths || []
            parentMenu.relevantPaths.push(this.routesMaps[item.customId].path as string)
          }
        }
      }
      return menus
    }
    res = recursion(old)
    return res
  }

  public transformMenu = (old: IUaaMenu): IMenuItem => {
    let menu: IMenuItem = {
      key: old.customId,
      text: old.text,
      icon: old.icon,
      path: old.link
    }
    if (old.type == 'BLANK_LINK') {
      menu.jumpMode = 'a'
      menu.target = '_blank'
      menu.externalUrl = old.link
    }
    return menu
  }

  public refreshToken = (): void => {
    // TODO: 这里的逻辑需要修改
    this.sendMessage({ type: PostMessageTypes.RefreshToken }, (res) => {
      this.setToken(res)
    })
  }

  public setToken = (obj?: IUaaTokenData): void => {
    if (obj) {
      sessionStorage.setItem('Authorization', JSON.stringify(obj))
    } else {
      sessionStorage.removeItem('Authorization')
    }
  }

  public getToken = (): IUaaTokenData | undefined => {
    let json = sessionStorage.getItem('Authorization')
    if (json) {
      try {
        return JSON.parse(json) as IUaaTokenData
      } catch {
        return
      }
    }
    return
  }

  public getSysInfo = (): IUaaAppInfo | undefined => {
    let json = sessionStorage.getItem('UaaSysInfo')
    if (json) {
      try {
        return JSON.parse(json) as IUaaAppInfo
      } catch {
        return
      }
    }
    return
  }

  public setSysInfo = (obj?: IUaaAppInfo): void => {
    if (obj) {
      sessionStorage.setItem('UaaSysInfo', JSON.stringify(obj))
    } else {
      sessionStorage.removeItem('UaaSysInfo')
    }
  }

  public signOut = () => {
    this.setSysInfo()
    this.setToken()
    if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'local2') {
      window.location.reload()
    } else {
      this.sendMessage({ type: PostMessageTypes.Logout })
    }
  }

  public closeLoader = (delay: number = 300) => {
    let loader = document.getElementById('loader')
    setTimeout(() => {
      if (loader) {
        loader.remove()
      }
    }, delay)
  }

  public canUse = (key: string): boolean => {
    return this.functionLimits.has(key)
  }

  public subscribePostMessage = (): void => {
    if (this.centerUrl) {
      window.addEventListener('message', this.postMessageHandler)
      window.onhashchange = (e: HashChangeEvent) => {
        const hash = window.location.hash
        if (hash !== '#/') {
          const message: IPostMessage = { type: PostMessageTypes.ChangeUrl, data: window.location.href }
          this.sendMessageToCenter(message)
        }
      }
    }
  }

  public sendMessage = (message: IPostMessage, callback?: (data: any) => void): boolean => {
    if (_.isFunction(callback)) {
      this.listens[message.type] = callback
    }
    return this.sendMessageToCenter(message)
  }

  public postMessageHandler = (e: MessageEvent) => {
    const message = e.data
    const origin = e.origin || (e as any).originalEvent.origin
    if (this.listens[message.type]) {
      if (origin === this.centerUrl) {
        this.listens[message.type](message.data)
        delete this.listens[message.type]
      } else {
        console.warn(`message origin：${origin}和center url：${this.centerUrl} 不一致`)
      }
    }
  }

  public sendMessageToCenter = (message: any) => {
    try {
      window.top.postMessage(message, this.centerUrl)
      return true
    } catch (e) {
      console.log('发送消息失败', e)
    }
  }

  /**
   * 启动 活跃用户监听
   * uaa 子系统与uaa跨域导致uaa无法监听子系统iframe事件时需要开启
   */
  private startActiveWatcher = () => {
    const { run: handleActive } = useThrottle(() => {
      this.sendMessage({ type: PostMessageTypes.ActiveWatcherUpdataLastTime })
    }, 50000)
    window.onload = function () {
      window.addEventListener('mousemove', handleActive)
      window.addEventListener('keydown', handleActive)
    }
    window.onunload = function () {
      window.removeEventListener('mousemove', handleActive)
      window.removeEventListener('keydown', handleActive)
    }
  }
}

interface IListen {
  [type: string]: (data: any) => void
}


const uaaApp = new UaaApp()

export { uaaApp }
