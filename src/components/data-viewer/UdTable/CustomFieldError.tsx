import React, { ReactNode } from 'react'
import { Tooltip } from 'antd'

const CustomFieldError: React.FC<ICustomFieldErrorProsp> = (props) => {
  return (
    <div className='edit-table-custom-field-errro-tips'>
      <Tooltip
        color='#ff4d4f'
        overlayStyle={{ visibility: props.errors?.length ? 'visible' : 'hidden' }}
        title={() => {
          return props.errors.map(item => {
            return <div>{item}</div>
          })
        }}>
        {props.children}
      </Tooltip>
    </div>
  )
}

interface ICustomFieldErrorProsp {
  children?: ReactNode,
  errors: string[]
}

export default CustomFieldError