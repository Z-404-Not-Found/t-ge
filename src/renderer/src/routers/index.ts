import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/chat',
      component: () => import('@renderer/views/Layout.vue'),
      children: [
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@renderer/views/Chat.vue'),
          meta: {
            title: '聊天'
          }
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('@renderer/views/Role.vue'),
          meta: {
            title: '角色'
          }
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('@renderer/views/Setting.vue'),
          meta: {
            title: '设置'
          }
        }
      ]
    },
    {
      path: '/update',
      name: 'update',
      component: () => import('@renderer/views/Updater.vue')
    }
  ]
})

export default router
