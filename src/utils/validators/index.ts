import { RuleObject } from 'antd/lib/form'

let validators = {
  /** 必填项 */
  required: (): RuleObject => {
    return { required: true }
  },
  /** 
   * 手机号码，最宽松模式
   */
  phone: (): RuleObject => {
    return {
      pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
      message: '请输入正确的手机号码'
    }
  },
  /**
   * 手机号码，严谨模式。
   */
  phoneCommonly: (): RuleObject => {
    return {
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      message: '请输入正确的手机号码'
    }
  },
  /**
   * 手机号码，最严格模式。
   */
  phoneStrict: (): RuleObject => {
    return {
      pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
      message: '请输入正确的手机号码'
    }
  },
  /**
   * 不能包含emoji表情
   */
  notContainEmoji: (): RuleObject => {
    return {
      validator: (rule, value, callback) => {
        let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
        if (reg.test(value)) {
          callback('不能包含emoji表情')
        } else {
          callback()
        }

      }
    }
  },
  /**
   * 能包含汉字、字母和数字
   */
  noSymbol: (): RuleObject => {
    return {
      pattern: /^[\w\u4e00-\u9fa5a-z]+$/gi,
      message: '只能包含汉字、字母和数字'
    }
  },
  /**
   * 不能包含特殊字符
   */
  noSpecialSymbol: (): RuleObject => {
    return {
      pattern: /[，。.？：；’‘”“！\w\u4e00-\u9fa5]+$/,
      message: '不能包含特殊字符'
    }
  },
  /**
   * 邮箱地址
   */
  email: (): RuleObject => {
    return {
      pattern: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      message: '请输入正确的邮箱地址'
    }
  }
}

export { validators }
