import React from 'react'
import { LocationDescriptorObject } from 'history'
import { generatePath, Redirect, RouteComponentProps } from 'react-router-dom'
import { uaaApp } from '../../..'

const ToByCustomId: React.FC<RouteComponentProps<{ customId: string }>> = (props) => {
  let customId = props.match.params.customId
  let route = uaaApp.routesMaps[customId]
  if (route && route.path) {
    let to: LocationDescriptorObject = {
      pathname: Array.isArray(route.path) ? route.path[0] : route.path
    }
    if (props.location.search) {
      let params = new URLSearchParams(props.location.search)
      try {
        if (params.has('params')) {
          to.pathname = generatePath(to.pathname!, JSON.parse(decodeURIComponent(params.get('params')!)))
        }
        if (params.has('state')) {
          to.state = JSON.parse(decodeURIComponent(params.get('state')!))
        }
        if (params.has('search')) {
          to.search = decodeURIComponent(params.get('search')!)
        }
      } catch (e) {
        console.error('路由参数有误', e, props.location.search)
      }
    }
    return <Redirect to={to} />
  }
  return <Redirect to="/" />
}

export { ToByCustomId }