import _ from 'lodash'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import Icon1 from '../assets/1.svg'
import Icon2 from '../assets/2.svg'
import Icon3 from '../assets/3.svg'
import Icon4 from '../assets/4.svg'
import Icon5 from '../assets/5.svg'

import Case1 from '../assets/case/管理中心.svg'
import Case2 from '../assets/case/基础.svg'
import Case3 from '../assets/case/渠道.svg'
import Case4 from '../assets/case/sap.svg'
import Case5 from '../assets/case/流程.svg'
import Case6 from '../assets/case/魔方.svg'
import Case7 from '../assets/case/营销参谋.svg'
import Case8 from '../assets/case/高端.svg'

import './Home.less'

const packageJson = require('../../../package.json')

const cases: any = [
  { title: 'UAA管理中心', image: <Case1 style={{ transform: 'scale(0.8)' }} />, desc: '统一权限体系，管理各大子系统' },
  { title: '基础服务', image: <Case2 style={{ transform: 'scale(0.9)' }} />, desc: '支撑中台各业务系统高效稳定的运行' },
  { title: '渠道中心', image: <Case3 style={{ transform: 'scale(0.9)' }} />, desc: '管理各大销售渠道' },
  { title: '科伦SAP', image: <Case4 style={{ transform: 'scale(1.1)' }} />, desc: '四川科伦药业中台项目' },
  { title: '流程中心', image: <Case5 style={{ transform: 'scale(0.9)' }} />, desc: '流程集中一体化管理' },
  { title: '数智魔方', image: <Case6 style={{ transform: 'scale(0.8)' }} />, desc: '智慧数字，带你解密商业魔方' },
  { title: '酒参谋', image: <Case7 style={{ transform: 'scale(0.8)' }} />, desc: '快速帮助用户把握酒类市场风向' },
  { title: '梵密', image: <Case8 style={{ transform: 'scale(0.9)' }} />, desc: '高端客户专属购物平台' }
]

const Home: React.FC = () => {
  let history = useHistory()
  return (
    <div className="page-home">
      <div className="banner">
        {/* <div className="banner-background">
          <img alt="background" src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*kJM2Q6uPXCAAAAAAAAAAAABkARQnAQ" />
        </div> */}
        <div className="banner-body">
          <div className="title">Ud Admin Framework</div>
          <div className="desc">花20%的时间做好管理系统中80%的功能</div>
          <ButtonGroup className="btn-box">
            <Button type="primary" onClick={() => history.push('/guide/Started')}>开始使用</Button>
            <Button onClick={() => location.href = packageJson.repository.url}>Gitlab</Button>
          </ButtonGroup>
        </div>
        <div className="banner-footer"></div>
      </div>
      <div className="block example">
        <div className="title">样例</div>
        <div className="content">
          <div className="img-box">
            <img src="./public/example-list.png" />
          </div>
          <div className="code-box">
            <img src="./public/example-code.png" />
          </div>
        </div>
      </div>
      <div className="block highlights">
        <div className="title">特点</div>
        <div className="content">
          <div className="item">
            <div className="item-icon"><Icon1 style={{ transform: 'scale(1.1)' }} /></div>
            <div className="item-title">简单快速</div>
            <div className="item-body">封装管理系统中常见场景，只需用类似 JSON 的代码来编写页面。</div>
          </div>
          <div className="item">
            <div className="item-icon"><Icon2 style={{ transform: 'scale(0.9)' }} /></div>
            <div className="item-title">高扩展性</div>
            <div className="item-body">各个组件和基础页面提供了很多API，可进行扩展使用。</div>
          </div>
          <div className="item">
            <div className="item-icon"><Icon3 style={{ transform: 'scale(1.4)' }} /></div>
            <div className="item-title">界面统一</div>
            <div className="item-body">所有组件和页面均做了界面限制，保证界面的高度统一性。</div>
          </div>
          <div className="item">
            <div className="item-icon"><Icon4 /></div>
            <div className="item-title">包容性</div>
            <div className="item-body">框架本身未使用任何状态管理器，可应用于已有的 React 项目中。</div>
          </div>
        </div>
      </div>
      <div className="block case">
        <div className="title">谁在使用</div>
        <div className="content">
          {
            cases.map((v, i) => {
              return (
                <div className="item" key={i}>
                  <div className="img">{v.image}</div>
                  <div className="introduce">
                    <div className="name">{v.title}</div>
                    <div className="description">{v.desc}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export { Home }