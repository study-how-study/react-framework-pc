
export interface IDocItem {
  index: IDocIndex,
  demos?: IDocDemo[]
}

export interface IDocIndex {
  meta: IDocItemMeta
  content: any[]
  demos: IDocDemoMeta[]
}

/**
 * 文档元数据
 */
export interface IDocItemMeta {
  /** 标题 */
  title: string
  /** 副标题 */
  subtitle: string
  /** 分类Code */
  category: string
  /** 路由路径 */
  path?: string
  /** 排序 */
  order: number
  /** 仓库文件地址 */
  repoFileUrl: string
}

export interface IDocDemo {
  key: string
  require: any
}

export interface IDocDemoMeta {
  title: string[]
  desc: string[]
  key: string
  repoFileUrl: string
}