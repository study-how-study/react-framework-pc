import _ from 'lodash'
import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { httpFactory, IUaaTokenData, IUaaAppInfo, uaaApp } from '../../../'
import { Icon } from '@ant-design/compatible'

const styles = {
  login: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e6e6e6 url("http://bing-wallpaper.top/random.jpg") center center'
  },
  panel: {
    width: '320px',
    borderRadius: '6px',
    marginTop: '-50px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(1px)'
  },
  panelH1: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 300,
    padding: '14px 0',
    marginBottom: '0',
    color: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
  },
  vercodeBox: {
    display: 'flex'
  },
  vercode: {
    minWidth: '130px',
    maxHeight: '32px',
    cursor: 'pointer',
    marginLeft: '10px',
    border: '1px solid #ccc'
  }
}

/**
 * 本地开发时，登录uaa使用。
 */
class UdLocalLogin extends Component<IUdLoginProps, IUdLoginState> {

  private authorization: IUaaTokenData = {} as IUaaTokenData
  private http: any;
  constructor(props: IUdLoginProps) {
    super(props)
    this.state = {
      loading: false
    }
    this.http = httpFactory.create()
    this.http.defaults.baseURL = this.props.loginApiBaseUrl
  }

  public componentDidMount() {
    uaaApp.closeLoader()
    this.getVerifyCode()
  }

  public render() {

    return (
      <div className="page-login" style={{ ...styles.login }}>
        <div className="login-panel" style={styles.panel}>
          <h1 style={styles.panelH1 as any}>开发环境登录界面</h1>
          <Form
            onFinish={this.handleSubmit} style={{ padding: '15px' }} className="login-form"
            initialValues={{
              username: this.props.username || '',
              password: this.props.password || '',
              vercode: 'UdIt'
            }}
          >
            <Form.Item name="username" style={{ marginBottom: '15px' }} rules={[{ required: true, message: '用户名不能为空' }]}>
              <Input prefix={<Icon type="user" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" style={{ marginBottom: '15px' }} rules={[{ required: true, message: '请输入登录密码' }]}>
              <Input prefix={<Icon type="lock" />} type="password" placeholder="密码" />
            </Form.Item>
            <Form.Item name="vercode" style={{ marginBottom: '15px' }} rules={[{ required: true, message: '请输入验证码' }]}>
              <div style={styles.vercodeBox}>
                <Input prefix={<Icon type="lock" />} placeholder="验证码" />
                <img style={styles.vercode} alt="验证码" title="点击更换验证码" onClick={() =>
                  this.getVerifyCode()} src={(this.state.verifyCode && this.state.verifyCode.srcBase64) || undefined}
                />
              </div>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center', margin: '0' }}>
              <Button style={{ lineHeight: '1' }} loading={this.state.loading} type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }

  protected getVerifyCode = () => {
    this.http.get('/api/uaa/uaa/sso/ssoCode').then((res: any) => {
      this.setState({
        verifyCode: res.data
      })
    })
  }

  protected handleSubmit = (values: any) => {
    let { ...user } = values
    user.uuid = this.state.verifyCode && this.state.verifyCode.uuid
    this.setState({ loading: true })
    this.http.post('/api/uaa/uaa/sso/ssoLogin', user).then(res => {
      this.getAccessToken(res.data.ticket)
    }, res => {
      this.setState({ loading: false })
      if (res.data.code == 152506 || res.data.code == 152507) {
        this.getVerifyCode()
      }
    })
  }

  private getAccessToken = (ticket: string) => {
    this.http.get(`/login?ticket=${ticket}`).then(
      (res) => {
        this.authorization = res.data;
        this.getMyInfo();
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

  private getMyInfo = () => {
    this.http.post('/my/info', {}, {
      headers: {
        Authorization: this.authorization.accessToken
      }
    }).then(res => {
      uaaApp.setToken(this.authorization)
      uaaApp.setSysInfo(res.data)
      window.location.reload()
    }, () => {
      this.setState({ loading: false })
    })
  }

}

interface IUdLoginProps {
  /**
   * 后端接口地址前缀
   */
  loginApiBaseUrl: string
  /**
   * 默认用户名
   */
  username?: string
  /**
   * 默认用户密码
   */
  password?: string
}

interface IUdLoginState {
  verifyCode?: IVerifyCode
  loading: boolean
}

interface IVerifyCode {
  srcBase64: string
  uuid: string
}

interface ILoginRes {
  ticket: string
  token: string
}

export default UdLocalLogin
