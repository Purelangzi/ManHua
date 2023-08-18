import { Message } from 'element-ui'
import dayjs from 'dayjs'
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 *分割换行符存储在一个数组，
  去除每个字符串两端的空白字符，过滤掉数组中的空字符串返回最终数组
 * @param {string} key
 * @returns
 */
export function handleKey(key) {
  return key.split('\n').map((item) => {
    return item.replace(/(^\s*)|(\s*$)/g, '')
  }).filter(item => item !== '')
}
/**
 * 复制字符串
 * @param {string} copytext 复制内容
 */
export function copyText(copytext) {
  // 如果浏览器支持这个新API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(copytext)
    Message.success('复制成功')
  } else {
    const text = document.createElement('input') // 创建节点
    text.setAttribute('readonly', 'readonly')
    text.value = copytext // 赋值
    document.body.appendChild(text) // 插入节点
    text.setSelectionRange(0, text.value.length)
    text.select() // 选中节点
    document.execCommand('copy') // 执行浏览器复制方法,该方法已弃用
    if (document.body.removeChild(text)) {
      Message.success('复制成功!')
    } else {
      Message.error('复制失败!')
    }
  }
}
/**
 * @description 格式化日期
 * @param time 2022-10-26T02:23:34.000Z
 * @returns 2022-10-26 10:23:34
 */
export const formatDate = (data) => {
  return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
  // return time..slice(0, 19).replace('T', ' ')
}
