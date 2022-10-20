import React from 'react'
import classNames from 'classnames'
import { Form } from 'antd'
import { UdForm, IUdModalContentProps, IUdFormProps } from '../..'

const UdModalForm: React.FC<IUdModalFormProps> = (props) => {

  const [form] = Form.useForm(props.form)

  if (props.getHandler) {
    props.getHandler(() => form.validateFields())
  }

  return (
    <UdForm
      {...props}
      form={form}
      className={classNames('ud-modal-form', props.className)}
    />
  )
}

UdModalForm.defaultProps = {
  layout: 'vertical',
  btns: null
}

export interface IUdModalFormProps extends IUdModalContentProps, IUdFormProps {

}

export { UdModalForm }