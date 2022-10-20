import { ReactNode } from 'react'

export interface IColumnActions {
  title: string | ReactNode
  auth?: string | ((text: any, model: any, index: number) => boolean)
  show?: (text: any, model: any, index: number) => boolean
  action: (text: any, model: any, index: number) => any
}

