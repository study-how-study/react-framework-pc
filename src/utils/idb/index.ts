
class Idb {

  private storeName: string = ''
  public dbName: string
  public dbVersion: number = 1
  public db: IDBDatabase | null = null

  constructor(dbName: string, version: number) {
    this.dbName = dbName
    this.dbVersion = version
  }

  public open(succes?: (db: IDBDatabase) => void, upgrade?: (db: IDBDatabase) => void) {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(this.dbName, this.dbVersion)
      request.onsuccess = (e) => {
        this.db = request.result
        succes && succes(this.db)
        resolve(this.db)
      }
      request.onerror = (e) => {
        reject(e)
      }
      request.onupgradeneeded = (e: any) => {
        this.db = e.target.result
        upgrade && upgrade(this.db!)
        resolve(this.db)
      }
    })
  }

  public close() {
    this.db?.close()
  }

  public use(storeName: string) {
    this.storeName = storeName
  }

  public get(query: IDBValidKey | IDBKeyRange, storeName?: string) {
    storeName = storeName || this.storeName
    let objectStore: IDBObjectStore = this.db!.transaction([storeName]).objectStore(storeName)
    return new Promise<any>((resolve, reject) => {
      let getRequest = objectStore.get(query)
      getRequest.onsuccess = (event: any) => {
        let data = event.target.result
        resolve(data)
      }
      getRequest.onerror = (event: any) => {
        reject(event)
      }
    })
  }

  public add(value: any, storeName?: string) {
    storeName = storeName || this.storeName as string
    return new Promise((resolve, reject) => {
      let objectStore: IDBObjectStore = this.db!.transaction([storeName!], 'readwrite').objectStore(storeName!)
      let setRequest = objectStore.add(value)
      setRequest.onsuccess = (e) => {
        resolve(e)
      }
      setRequest.onerror = (e) => {
        reject(e)
      }
    })
  }

  public put(value: any, storeName?: string) {
    storeName = storeName || this.storeName
    return new Promise((resolve, reject) => {
      let objectStore: IDBObjectStore = this.db!.transaction([storeName!], 'readwrite').objectStore(storeName!)
      let setRequest = objectStore.put(value)
      setRequest.onsuccess = (e) => {
        resolve(value)
      }
      setRequest.onerror = (e) => {
        reject(e)
      }
    })
  }

  public del(key: IDBValidKey | IDBKeyRange, storeName?: string) {
    storeName = storeName || this.storeName
    return new Promise((resolve, reject) => {
      let objectStore: IDBObjectStore = this.db!.transaction([storeName!], 'readwrite').objectStore(storeName!)
      let setRequest = objectStore.delete(key)
      setRequest.onsuccess = (e) => {
        resolve(key)
      }
      setRequest.onerror = (e) => {
        reject(e)
      }
    })
  }

}

export { Idb }
