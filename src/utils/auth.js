import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserInfo = 'userInfo'
const menus = 'menus'
const resultMenus = 'resultMenus'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  // 因为获取cookie里的userInfo需要时间,JSON方法的参数会为空立即报错
  if (typeof Cookies.get(UserInfo) === 'string') {
    return JSON.parse(Cookies.get(UserInfo))
  } else {
    return Cookies.get(UserInfo)
  }
}
export function setUserInfo(info) {
  return Cookies.set(UserInfo, JSON.stringify(info))
}
export function removeUserInfo() {
  return Cookies.remove(UserInfo)
}

export function getMenus() {
  return JSON.parse(localStorage.getItem(menus))
}
export function setMenus(data) {
  return localStorage.setItem(menus, JSON.stringify(data))
}
export function removeMenus() {
  return localStorage.removeItem(menus)
}

export function getResultMenus() {
  return JSON.parse(localStorage.getItem(resultMenus))
}
export function setResultMenus(data) {
  return localStorage.setItem(resultMenus, JSON.stringify(data))
}
export function removeResultMenus() {
  return localStorage.removeItem(resultMenus)
}
