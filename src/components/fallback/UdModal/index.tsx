import _ from 'lodash'
import React, { } from 'react'
import ReactDOM from 'react-dom'
import { Modal, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import destroyFns from 'antd/lib/modal/destroyFns'
import { ModalProps } from 'antd/lib/modal/Modal'
import { Icon } from '@ant-design/compatible'
import { useStepsModal } from './hooks/useStepsModal'

// TODO destroyFns 和运行时的 antd destroyFns 不是同一个变量，导致无法通过 Modal.destroyAll() 来销毁，可能是打包工具的问题，暂时没有处理。

const IS_REACT_16 = !!ReactDOM.createPortal

const UdModal = {
  defaultProps: {
    okText: '确定',
    cancelText: ' 取消',
    centered: false,
    scroll: 'unset',
  } as Partial<IUdModelProps>,
  open: (props: IUdModelProps) => {
    let config = _.defaults({ centered: props.scroll === 'auto' ? true : props.centered },
      props, UdModal.defaultProps,
      {
        className: props.scroll === 'auto' ? 'modal-content-overflow-scroll' : ''
      })
    const div = document.createElement('div')
    document.body.appendChild(div)

    let currentConfig = { ...config, confirmLoading: false, visible: true } as any
    let contentHandler: any

    let content = currentConfig.content
    if (_.isString(content)) {
      content = <div>{content}</div>
    } else {
      if (!_.isString(currentConfig.content.type)) { // 普通html元素不进行props注入，避免react警告
        content = React.cloneElement(currentConfig.content, {
          getHandler: (handler: (handler: () => any) => void) => {
            contentHandler = handler
          },
        })
      }
    }

    function render(props: IUdModelProps) {
      ReactDOM.render(
        <ConfigProvider locale={zhCN}>
          <Modal {...props} onOk={ok} onCancel={() => close({ triggerCancel: true })}>
            {content}
          </Modal>
        </ConfigProvider>, div)
    }

    function ok() {
      let value: any = null
      let inner = () => {
        if (config.onOk) {
          let result = config.onOk(value)
          if (result && _.isFunction(result.then)) {
            update({ confirmLoading: true })
            result.then(() => {
              close()
            }).finally(() => {
              update({ confirmLoading: false })
            })
          } else {
            close()
          }
        } else {
          close()
        }
      }
      if (contentHandler) {
        value = contentHandler()
        if (value && _.isFunction(value.then)) {
          update({ confirmLoading: true })
          value.finally(() => {
            update({ confirmLoading: false })
          }).then((res: any) => {
            value = res
            inner()
          })
        } else {
          inner()
        }
      } else {
        inner()
      }
    }

    function update(newConfig: Partial<IUdModelProps>) {
      currentConfig = { ...currentConfig, ...newConfig }
      render(currentConfig)
    }

    function close(this: any, ...args: any[]) {
      currentConfig = {
        ...currentConfig,
        visible: false,
        afterClose: destroy.bind(this, ...args),
      }
      if (IS_REACT_16) {
        render(currentConfig)
      } else {
        destroy(...args)
      }
    }

    function destroy(...args: any[]) {
      const unmountResult = ReactDOM.unmountComponentAtNode(div)
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div)
      }
      const triggerCancel = args.some(param => param && param.triggerCancel)
      if (config.onCancel && triggerCancel) {
        config.onCancel(...args)
      }
      for (let i = 0; i < destroyFns.length; i++) {
        const fn = destroyFns[i]
        if (fn === close) {
          destroyFns.splice(i, 1)
          break
        }
      }
    }

    render(currentConfig)

    destroyFns.push(close)

    return {
      destroy: close,
      update
    }
  },
  confirm: (props: IUdModelProps) => {
    return UdModal.open({
      title: '系统提示',
      centered: true,
      ...props,
      content: (
        <div className="ud-modal-confirm-wrapper">
          <div className="ud-modal-confirm-icon"><Icon type="question-circle" /></div>
          <div className="ud-modal-confirm-content">{props.content}</div>
        </div>
      )
    })
  },
  useStepsModal: useStepsModal
}

export interface IUdModelProps extends ModalProps {
  /**
   * 模态框内容
   */
  content: React.ReactNode
  /**
   * OK事件
   */
  onOk?: (value: any) => (void | Promise<any>)
  /**
   * Cancel事件
   */
  onCancel?: (...args: any[]) => void

  /**
   * 内容超出应对模式，如果配置为auto, `centered`属性将为true，不可更改-我们认为只有在内容超出的时候才配置overflow，居中能显示更多
   * @deufault unset
   */
  scroll?: 'unset' | 'auto'
}

export interface IUdModalContentProps {
  getHandler?: (handler: () => any) => void
}

export { UdModal }