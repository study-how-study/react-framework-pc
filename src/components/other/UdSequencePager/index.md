---
title: UdSequencePager
subtitle: 深度分页器
category: other
order: 3
---

深度分页器，主要用于列表数据量太大的情况。

不查询数据总数和总页数，只提供上一页、下一页和每页展示数量切换。

> 结合 UdBaseListPage 使用，通过配置 paginationModel === 'SEQUENCE_PAGER' 时生效，同时需要pagination配置不能为false

## API

### Props

<!-- ud-ts("index.tsx", "IUdSequencePagerProps") -->

### onChange提供的值 ISequencePageRequestVo  

<!-- ud-ts("index.tsx", "ISequencePageRequestVo") -->

> 在 UdBaseListPage 中使用，props 由 UdBaseListPage 传递给简单分页器，如果需要配置 pageSizeOption，参考下面的 demo

<!-- ud-demo("基本用法", "最基本的用法", "demos/basic.tsx") -->
<!-- ud-demo("calss版本的基础列表页", "class版本的基础列表页接入深度分页器", "demos/classListPage.tsx") -->
<!-- ud-demo("hooks版本的基础列表页", "hooks版本的基础列表页接入深度分页器", "demos/hookListPage.tsx") -->
