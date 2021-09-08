import Vue from 'vue'
import Router from 'vue-router'
import Main from '../view/Main'
import Error from '../view/Error'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/view/Registration')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/Login')
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'index',
          name: 'index',
          meta: {
            title: '首页'
          },
          component: () => import('@/view/home/Index')
        },
        {
          path: 'money',
          name: 'money',
          component: () => import('@/view/money/Index')
        },
        {
          path: 'charge',
          name: 'charge',
          component: () => import('@/view/charge/Index')
        },
        {
          path: 'agent',
          name: 'agent',
          component: () => import('@/view/agent/Index')
        },
        {
          path: 'task',
          name: 'task',
          component: () => import('@/view/task/Index')
        },
        {
          path: 'shop',
          name: 'shop',
          component: () => import('@/view/shop/Index')
        }
      ],
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '*',
      redirect: '/error',
      hidden: true
    }
  ]
})
