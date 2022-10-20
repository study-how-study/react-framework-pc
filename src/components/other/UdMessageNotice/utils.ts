
export const turnPage = (url: string, type: 'INNER_LINK' | 'BLANK_LINK') => {
  const aEle = document.createElement('a')
  aEle.href = url
  if (type === 'BLANK_LINK') {
    aEle.target = '_blank'
  }
  document.body.appendChild(aEle)
  aEle.click()
  document.body.removeChild(aEle)
}


// TODO: 如果长时间挂机，消息数量过多的情况怎么处理
export const pannelMsgCountOverCrop = (list: any[], count: number)=> {
  if(list.length<=count) {
    return list
  }
  return list.slice(0, count)
}