import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      let userInfo = JSON.parse(JSON.stringify(store.getters.userInfo))
      if(typeof userInfo =='string'){
        userInfo = JSON.parse(userInfo)
      }
      const hasGetUserInfo = userInfo.username
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/login')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error('token失效了' || error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      // 服务器返回的菜单不为空，添加动态路由
      if(store.getters.menus.length>0){
        // 只有首页刷新页面不会空白：isAddRoute永远为1，所以判断from.path
        if (store.getters.isAddRoutes == '0'||from.path=='/') {
          console.log('添加动态路由');
          await store.dispatch('user/addRoutes')
          next({ ...to, replace: true })
        } else {
          next()
        }
      }else{
        // 添加默认路由
        console.log(store.getters.isDefaultRoutes,from.path);
        if(!store.getters.isDefaultRoutes||from.path=='/'){
          console.log('没有权限，添加默认路由');
          await store.dispatch('user/addDefaultRoutes')
          next({ ...to, replace: true })
          NProgress.done()
        }else{
          next()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
