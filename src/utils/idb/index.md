---
title: idb
subtitle: indexedDB
category: utils
order: 5
---

简单封装了下 indexedDB 的 API。

## 基本用法

```ts
import { Idb } from "@ud/admin-framework";

let db = new Idb("database-name");

await db.open();

db.use("store-name");

let row = await db.get("row-key");
```

## 方法

### open

打开数据库，异步。

```ts
open(upgrade?: (db: IDBDatabase) => void);
```

### close

关闭数据库，同步。

```ts
close();
```

### use

使用指定的 storeName，同步。

```ts
use(storeName: string);
```

### get

获取数据，异步。

```ts
get(query: IDBValidKey | IDBKeyRange, storeName?: string);
```

### add

添加数据，异步。

```ts
add(value: any, storeName?: string);
```

### put

修改数据，异步。

```ts
put(value: any, storeName?: string);
```

### del

删除数据，异步。

```ts
del(key: IDBValidKey | IDBKeyRange, storeName?: string);
```
