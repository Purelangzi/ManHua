import { login, register } from '@/api/user'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo,
  setMenus, getMenus, removeMenus, getResultMenus, setResultMenus, removeResultMenus } from '@/utils/auth'
import { resetRouter, constantRoutes, asyncRoutes, anyRoutes } from '@/router'
import router from '@/router'

import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: getUserInfo(),
    resultMenus: getResultMenus(),
    menus: getMenus(),
    // 判断是否已添加动态路由，0未添加,1已添加
    isAddRoutes: localStorage.getItem('isAddRoutes') || '0',
    // 判断是否已添加静态路由
    isDefaultRoutes: localStorage.getItem('isDefaultRoutes') || false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_MENU: (state, menus) => {
    state.menus = menus
  },
  // 添加动态路由
  SET_RESULTMENUS: (state, asyncRoutes) => {
    // 路由合并
    state.resultMenus = constantRoutes.concat(asyncRoutes, anyRoutes)
    // 本地存储localStorage
    setResultMenus(state.resultMenus)
    resetRouter()
    // router.options.routes = state.resultMenus
    router.addRoutes(state.resultMenus)
    state.isAddRoutes = '1'
    localStorage.setItem('isAddRoutes', '1')
  },
  // 添加默认路由（静态和任意路由）
  SET_DEFALUTMENUS: (state) => {
    state.resultMenus = constantRoutes.concat(anyRoutes)
    resetRouter()
    router.addRoutes(state.resultMenus)
    state.isDefaultRoutes = true
    localStorage.setItem('isDefaultRoutes', true)
  }
}

// 对比异步路由，服务器返回的menus有children，异步路由也有children，双层嵌套
const computedAsyncRoutes = (asyncRoutes, menus) => {
  return asyncRoutes.filter(el => {
    return menus.some(item => {
      if (item.name === el.name) {
        // 异步路由有子菜单，menus也必然有子菜单
        if (el.children && el.children.length) {
          el.children = computedAsyncRoutes(el.children, item.children)
        }
        return true
      }
    })
  })
}
const actions = {
  // 用户登录
  async login({ commit, dispatch, state }, userInfo) {
    const { account, password } = userInfo
    try {
      const res = await login({ account, password })
      if (res.code !== 200) {
        throw new Error(res.msg)
      }
      const { data } = res
      commit('SET_TOKEN', data.token)
      commit('SET_USERINFO', data.userInfo)
      commit('SET_MENU', data.menus)
      localStorage.setItem('isAddRoutes', '0')
      localStorage.setItem('isDefaultRoutes', false)

      // 添加动态路由
      dispatch('addRoutes')
      setToken(data.token)
      setUserInfo(data.userInfo)
      setMenus(data.menus)
    } catch (error) {
      throw new Error(error.message)
    }
  },
  // 添加动态路由
  addRoutes({ commit, state }) {
    // 深拷贝，对比异步路由
    commit('SET_RESULTMENUS', computedAsyncRoutes(cloneDeep(asyncRoutes), state.menus))
  },
  // 添加默认路由（静态和任意路由）
  addDefaultRoutes({ commit }) {
    console.log('添加默认路由')
    commit('SET_DEFALUTMENUS')
  },
  // 退出登录
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    removeUserInfo()
    removeMenus()
    removeResultMenus()
    localStorage.removeItem('isAddRoutes')
    localStorage.removeItem('isDefaultRoutes')
    commit('RESET_STATE')
  },

  async register({ commit }, userInfo) {
    const { account, password, username } = userInfo
    try {
      const res = await register({ account, password, username })
      if (res.code !== 200) {
        throw new Error(res.msg)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

