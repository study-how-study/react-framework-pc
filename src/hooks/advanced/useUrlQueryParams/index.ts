import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { routeUtils } from '../../..'

function useUrlQueryParams<T = any>(defaultQueryParams: Partial<T>):
  [T, ((params?: Partial<T>, merge?: boolean) => void)] {

  const location = useLocation()
  const history = useHistory()

  const [urlQueryParams, setUrlQueryParams] = useState<T>(() => {
    return routeUtils.searchStringToObject(location.search, defaultQueryParams)
  })

  useEffect(() => {
    let params = routeUtils.searchStringToObject(location.search, defaultQueryParams)
    if (!_.isEqual(params, urlQueryParams)) {
      setUrlQueryParams(params)
    }
  }, [location])

  /**
   * push Url查询参数
   * @param params 要改变的参数
   * @param merge true：合并，false：替换
   */
  const pushUrlQueryParams = (params?: Partial<T>, merge: boolean = true) => {
    let query = urlQueryParams
    if (params) {
      if (merge) {
        query = _.extend({}, urlQueryParams, params)
      } else {
        query = params as any
      }
    }
    history.push({
      pathname: location.pathname,
      search: routeUtils.objectToSearchString(query)
    })
  }

  return [urlQueryParams, pushUrlQueryParams]

}

export { useUrlQueryParams }