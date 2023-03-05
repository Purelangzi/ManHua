import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name:'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name:'404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: '首页',
      component: () => import('@/views/home'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  
  // 404 page must be placed at the end !!!
  
]
export const asyncRoutes = [
  {
    name:'漫画管理',
    path:'/cartoonManager',
    component:Layout,
    redirect: '/cartoonManager',
    meta: {title:'漫画管理',icon: 'manager' },
    children:[
      {
        path: '/cartoonCategory',
        name: '漫画分类',
        meta: { title: '漫画分类',icon:'category'},
        component: () => import('@/views/cartoonManager/cartoonCategory')
      },
      {
        path: '/cartoonList',
        name: '漫画列表',
        meta: { title: '漫画列表',icon:'list' },
        component: () => import('@/views/cartoonManager/cartoonList')
      }
    ]
  },

  {
    path: '/datacenter',
    name: '数据中心',
    component: Layout,
    redirect: '/datacenter',
    meta: {title:'数据中心',icon: 'manager' },
    children: [
      {
        path: '/cartoonCollection',
        name: '漫画采集',
        meta: { title: '漫画采集',icon:'collection'},
        component: () => import('@/views/datacenter/cartoonCollection')
      },
    ]
  },
  {
    path: '/novelManager',
    name: '小说管理',
    component: Layout,
    redirect: '/novelManager',
    meta: {title:'小说管理',icon: 'manager' },
    children: [
      {
        path: '/novelCategory',
        name: '小说分类',
        meta: { title: '小说分类',icon:'category'},
        component: () => import('@/views/novelManager/novelCategory')
      },
      {
        path: '/novelList',
        name: '小说列表',
        meta: { title: '小说列表',icon:'list'},
        component: () => import('@/views/novelManager/novelList')
      }
    ]
  },
  {
    path: '/videoManager',
    name: '视频管理',
    component: Layout,
    redirect: '/videoManager',
    meta: {title:'视频管理',icon: 'manager' },

    children: [
      {
        path: '/videoCategory',
        name: '视频分类',
        meta: { title: '视频分类',icon:'category' },
        component: () => import('@/views/videoManager/videoCategory')
      },
      {
        path: '/videoList',
        name: '视频列表',
        meta: { title: '视频列表',icon:'list'},
        component: () => import('@/views/videoManager/videoList')
      }
    ]
  },
]
export const anyRoutes = [{ path: '*', redirect: '/404', hidden: true }]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
