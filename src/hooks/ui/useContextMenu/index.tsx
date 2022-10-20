import _ from 'lodash'
import React, { ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { ClassValue } from 'classnames/types'

const useContextMenu = () => {

  const wrapperRef = useRef<HTMLDivElement>()
  const contextMenuRef = useRef<HTMLUListElement>()
  const triggerElement = useRef<HTMLElement>()

  useEffect(() => {
    wrapperRef.current = document.createElement('div')
    document.body.append(wrapperRef.current)
    document.addEventListener('click', () => {
      if (contextMenuRef.current) {
        contextMenuRef.current.style.display = 'none'
      }
    })
    return () => {
      wrapperRef.current && wrapperRef.current.remove()
    }
  }, [])

  const bind = (action: IUdContextMenuItem[] | ((e: any) => IUdContextMenuItem[] | void)) => {

    const render = (items: IUdContextMenuItem[]) => {
      ReactDOM.render((
        <ul
          ref={(e) => e && (contextMenuRef.current = e)}
          className="ud-context-menu ant-dropdown-menu ant-dropdown-menu-light ant-dropdown-menu-root ant-dropdown-menu-vertical">
          {
            items.map((item, index) => {
              if (React.isValidElement(item)) {
                return item
              }
              const menu = item as IUdContextMenuItemProps
              return (
                <li
                  key={index}
                  className={classNames('ant-dropdown-menu-item ant-dropdown-menu-item-only-child', menu.className)}
                  onClick={() => {
                    const { onClick, ...otherProps } = menu
                    onClick && onClick(otherProps)
                  }}
                >
                  {menu.content}
                </li>
              )
            })
          }
        </ul>
      ), wrapperRef.current!)
    }

    let listener = (e: any) => {
      e.preventDefault()
      const { clientX, clientY } = e
      let items = _.isFunction(action) ? action(e) : action
      if (_.isArray(items) && items.length > 0) {
        render(items)
        if (contextMenuRef.current) {
          contextMenuRef.current.style.display = 'block'
          contextMenuRef.current.style.left = clientX + 'px'
          contextMenuRef.current.style.top = clientY + 'px'
        }
      }
    }

    triggerElement.current && triggerElement.current.addEventListener('contextmenu', listener)
    return () => {
      triggerElement.current && triggerElement.current.removeEventListener('contextmenu', listener)
    }
  }

  return {
    triggerElement,
    bindContextMenu: bind
  }
}

export interface IUdContextMenuItemProps<T = any> {
  className?: ClassValue
  content?: ReactNode
  data?: T
  onClick?: (e: IUdContextMenuItemProps<T>) => void
}

export type IUdContextMenuItem = ReactNode | IUdContextMenuItemProps

export { useContextMenu }
