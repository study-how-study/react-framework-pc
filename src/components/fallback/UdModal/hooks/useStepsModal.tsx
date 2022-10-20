import _ from 'lodash'
import React, { ReactElement, useRef, useState } from 'react'
import classNames from 'classnames'
import { Button, Modal, ModalProps, StepProps, Steps, StepsProps } from 'antd'

const useStepsModal = () => {

  const [visible, setVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const dataset = useRef({})
  const handlers = useRef<UdStepsNext[]>([])

  const stepExec = (action: (handlerResult?: any) => void, next?: UdStepsNext, handlerResult?: any) => {
    if (next) {
      let result = next(dataset, handlerResult)
      if (result === null || result === undefined || result === true) {
        action()
      } else if (_.isFunction((result as any).then)) {
        setLoading(true);
        (result as any).then((values) => {
          action(values)
          setLoading(false)
        }, () => setLoading(false))
      }
    } else {
      action()
    }
  }

  const render = (props: IUdStepsModal) => {
    let { modalProps = {}, steps, stepsProps = {} } = props
    stepsProps = { direction: 'horizontal', ...stepsProps }

    const closeModal = () => {
      if (modalProps.destroyOnClose !== false) {
        setVisible(false)
        setCurrentStep(0)
        dataset.current = {}
        handlers.current = []
        setLoading(false)
      }
      modalProps.onCancel && modalProps.onCancel(null)
    }

    const previous = () => {
      setCurrentStep(currentStep > 0 ? currentStep - 1 : 0)
    }

    const next = (action: () => void) => {
      let inner = (handlerResult?: any) => {
        stepExec(action, steps[currentStep].next, handlerResult)
      }
      if (handlers.current[currentStep]) {
        stepExec(inner, handlers.current[currentStep])
      } else {
        inner()
      }
    }

    const getFooterBtns = () => {
      return (
        <div className="btns">
          <Button onClick={closeModal}>取消</Button>
          {currentStep > 0 && <Button onClick={previous} disabled={loading}>上一步</Button>}
          {
            currentStep < steps.length - 1 && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  next(() => setCurrentStep(currentStep < steps.length - 1 ? currentStep + 1 : steps.length - 1))
                }}>下一步</Button>
            )}
          {
            currentStep == steps.length - 1 && (
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  next(() => stepExec(closeModal, props.done))
                }}>完成</Button>
            )}
        </div>
      )
    }

    const className = classNames(
      `ud-steps-modal`,
      `ud-steps-modal-${stepsProps.direction}`,
      modalProps.className
    )

    return (
      <Modal
        keyboard={false}
        maskClosable={false}
        destroyOnClose
        centered
        {...modalProps}
        onCancel={closeModal}
        className={className}
        visible={visible}
        footer={getFooterBtns()}
      >
        <Steps current={currentStep} {...stepsProps}>
          {steps.map(n => {
            let { content, ...stepProps } = n
            return <Steps.Step {...stepProps} />
          })}
        </Steps>
        <div className="ud-steps-modal-step-container">
          {steps.map((step, index) => {
            let content = step.content.type === React.Fragment ? <div>{step.content}</div> : step.content
            let className = classNames(content.props.className, 'ud-steps-modal-step-content', { active: currentStep === index }, { inactive: currentStep !== index })
            return React.cloneElement(content, {
              className: className,
              active: currentStep === index,
              getHandler: (handler: UdStepsNext) => handlers.current[index] = handler
            })
          })}
        </div>
      </Modal>
    )
  }

  return {
    visible,
    setVisible,
    currentStep,
    setCurrentStep,
    dataset,
    render
  }
}

export interface IUdStepsModal {
  modalProps?: ModalProps
  stepsProps?: StepsProps
  steps: IUdStepsModalStep[]
  done?: UdStepsNext
}

export type UdStepsNext = (dataset: React.MutableRefObject<any>, handlerResult?: any) => void | undefined | null | boolean | Promise<void | object>

export interface IUdStepsModalStep extends StepProps {
  content: ReactElement
  next?: UdStepsNext
}

export { useStepsModal }