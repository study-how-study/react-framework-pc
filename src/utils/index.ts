import _ from 'lodash'
import { uaaApp } from '../core'

export * from './columnActions'
export * from './columnRenders'
export * from './colUtils'
export * from './formUtils'
export * from './idb'
export * from './routeUtils'
export * from './validators'
export * from './udPolling'

/**
 * 是否为手机端访问
 * 如：chrome 移动端模拟、手机浏览器等
 */
const isPhone = (): boolean => {
  const mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return mobile != null
}

/**
 * 是否被公司的app内嵌
 */
const isAppEmbed = (): boolean => {
  return _.get(window, 'ubBridge.platform', null) === 'app'
}

const buildAppExternalLink = (path: string, options: { appCode?: string } = {}) => {
  if (process.env.REACT_APP_ENV == 'local' ||  process.env.REACT_APP_ENV == 'local2') {
    return path
  }
  return uaaApp.centerUrl + '#/system/' + (options.appCode || uaaApp.appCode) + '/' + encodeURIComponent(path)
}

const getWebUrlByAppCode = (appCode: string): string => {
  const sysInfo = uaaApp.getSysInfo()
  const webUrls = sysInfo.webUrls
  const url = _.get(webUrls, appCode, '')
  return url
}

const isJSON = (str: string, options?) => {
  function merge(obj = {}, defaults) {
    for (const key in defaults) {
      if (typeof obj[key] === 'undefined') {
        obj[key] = defaults[key];
      }
    }
    return obj;
  }
  function assertString(input) {
    const isString = typeof input === 'string' || input instanceof String;
  
    if (!isString) {
      let invalidType: any = typeof input;
      if (input === null) invalidType = 'null';
      else if (invalidType === 'object') invalidType = input.constructor.name;
  
      throw new TypeError(`Expected a string but received a ${invalidType}`);
    }
  }
  assertString(str);
  const default_json_options = {
    allow_primitives: false,
  };
  try {
    options = merge(options, default_json_options);
    let primitives: any = [];
    if (options.allow_primitives) {
      primitives = [null, false, true];
    }

    const obj: any = JSON.parse(str);
    return primitives.includes(obj) || (!!obj && typeof obj === 'object');
  } catch (e) { /* ignore */ }
  return false;
}


export { isPhone, isAppEmbed, buildAppExternalLink, getWebUrlByAppCode, isJSON }
