import React, { Suspense, ErrorInfo } from 'react'
import { Switch } from 'react-router-dom'
import { UdRouterFallback } from '../..'

class UdSuspense extends React.Component<{}, IUdSuspenseState> {

  constructor(props: IUdSuspenseState) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-error">
          页面加载失败，请刷新页面再试或联系管理员。
        </div>
      )
    }
    return (
      <Suspense fallback={<UdRouterFallback />}>
        <Switch>
          {this.props.children}
        </Switch>
      </Suspense>
    )
  }

}

export interface IUdSuspenseState {
  hasError: boolean
}

export { UdSuspense }