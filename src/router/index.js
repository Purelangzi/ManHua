import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 *注意：子菜单仅在路由子项时显示。长度>=1

*详细信息请参阅：https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html

*

*hidden:true如果设置为true，项目将不会显示在侧边栏中（默认为false）

*alwaysShow:true如果设置为true，将始终显示根菜单

*如果不设置alwaysShow，当项目有多个子路由时，

*它将变为嵌套模式，否则不显示根菜单

*redirect:noRedirect如果设置为noRedirect，则面包屑中不会重定向

*name：'router-name'＜keep-alive＞使用的名称（必须设置！！！）

*meta：{

roles：['admin'，'editor']控制页面角色（可以设置多个角色）

title：“title”显示在侧边栏和面包屑中的名称（推荐集）

icon:“svg名称”/“l-icon-x”图标显示在侧边栏中

breadcrumb：false如果设置为false，则该项将隐藏在breadcrump中（默认值为true）

activeMenu:'/example/list'如果设置了路径，侧边栏将突出显示您设置的路径

}
 */

/**
 * 常量路由
*没有权限要求的基页
*所有角色都可以访问
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
      meta: { title: '首页', icon: 'home' ,keepAlive:true}
    }]
  },
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
        meta: { title: '漫画分类',icon:'category',keepAlive:true},
        component: () => import('@/views/cartoonManager/cartoonCategory')
      },
      {
        path: '/cartoonList',
        name: '漫画列表',
        meta: { title: '漫画列表',icon:'list',keepAlive:true},
        component: () => import('@/views/cartoonManager/cartoonList')
      }
    ]
  },

  {
    path: '/datacenter',
    name: '数据中心',
    component: Layout,
    redirect: '/datacenter',
    // 显示一级菜单
    alwaysShow:true,
    meta: {title:'数据中心',icon: 'manager'},
    children: [
      {
        path: '/cartoonCollection',
        name: '漫画采集',
        meta: { title: '漫画采集',icon:'collection',keepAlive:true},
        component: () => import('@/views/datacenter/cartoonCollection')
      },
    ]
  },
  {
    path: '/systemManager',
    name: '系统管理',
    component: Layout,
    redirect: '/systemManager',
    meta: {title:'系统管理',icon: 'manager' },
    children: [
      {
        path: '/account',
        name: '账号管理',
        meta: { title: '账号管理',icon:'manager',keepAlive:true },
        component: () => import('@/views/systemManager/account')
      },
      {
        path: '/role',
        name: '角色管理',
        meta: { title: '角色管理',icon:'manager',keepAlive:true },
        component: () => import('@/views/systemManager/role')
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
        meta: { title: '小说分类',icon:'category',keepAlive:true},
        component: () => import('@/views/novelManager/novelCategory')
      },
      {
        path: '/novelList',
        name: '小说列表',
        meta: { title: '小说列表',icon:'list',keepAlive:true},
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
        meta: { title: '视频分类',icon:'category',keepAlive:true },
        component: () => import('@/views/videoManager/videoCategory')
      },
      {
        path: '/videoList',
        name: '视频列表',
        meta: { title: '视频列表',icon:'list',keepAlive:true},
        component: () => import('@/views/videoManager/videoList')
      }
    ]
  },
  {
    path: '/orderManager',
    name: '订单管理',
    component: Layout,
    redirect: '/orderManager',
    // 显示一级菜单
    alwaysShow:true,
    meta: {title:'订单管理',icon: 'manager' },
    children: [
      {
        path: '/orderList',
        name: '订单列表',
        meta: { title: '订单列表',icon:'list' },
        component: () => import('@/views/orderManager/orderList')
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
