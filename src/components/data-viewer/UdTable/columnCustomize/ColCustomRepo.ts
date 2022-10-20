import { uaaApp, Idb } from '../../../..'

export interface ICustomColumnsItem {
  key: string
  show: boolean
  color?: string
  widths?: { // 目前界面只做了 自适应 和 固定宽度 的支持，如果后期需要支持 min 和 max ，配置界面需要改动。而数据结构不用变
    minWidth?: string
    maxWidth?: string
    fixedWidth?: string
  },
  fixed?: '' | 'left' | 'right'
}

class ColCustomRepo {

  private db = new Idb('ud-' + uaaApp.appCode, 2)
  private storeName = 'table-column-columnize'

  public async open() {
    await this.db.open(undefined, (db) => {
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id' })
      }
    })
    this.db.use(this.storeName)
  }

  public close() {
    this.db!.close()
  }

  public async get(tableKey: string) {
    let res = await this.db.get(tableKey)
    return (res ? res.value : []) as ICustomColumnsItem[]
  }

  public async set(tableKey: string, newValues: ICustomColumnsItem[]) {
    let oldValues = await this.db.get(tableKey)
    if (oldValues) {
      await this.db.put({ id: tableKey, value: newValues })
    } else {
      await this.db.add({ id: tableKey, value: newValues })
    }
  }

  public async del(tableKey: string) {
    await this.db.del(tableKey)
  }

}

export { ColCustomRepo }
